import { Injectable } from '@angular/core';
import { LedgerError, requiredTrustedNotaries } from '@viewer/models';
import { u8ToBase64 } from '@viewer/utils';
import { BehaviorSubject } from 'rxjs';

import { AcknowledgementService } from './acknowledgement.service';
import { DotNetWrapperService } from './dotnet-wrapper.service';
import { LedgerObjectsService } from './ledger-objects.service';
import { isEncapsulation, StorageService } from './storage.service';
import { formatValidationError } from '../utils/validation';
import { NotaryService } from './notary.service';

export interface ValidatedBlock {
  blockIndex: number;
  block: Ledger.Parser.Block;
  linkHash: Uint8Array;
  writeReceipt?: Ledger.Validator.WriteReceipt;
  terminalBlock: Ledger.Parser.TerminalBlock;
  getDecrypted(): Promise<Uint8Array>;
}

@Injectable({ providedIn: 'root' })
export class LedgerService {
  problems: string[] = [];
  archiveLoaded = false;

  readonly reset$ = new BehaviorSubject<void>(undefined);

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dotNet: DotNetWrapperService,
    private readonly ledgerObjectsService: LedgerObjectsService,
    private readonly notaryService: NotaryService,
    private readonly storageService: StorageService,
  ) { }

  async *load(data: Blob | string) {
    this.reset();
    await this.storageService.load(data);

    const info = await this.storageService.getLedgerInfo();
    const notaries = await this.storageService.getNotaries();
    const state = await this.dotNet.makeValidator(info.address);
    const totalBlocks = info.headIndex + 1;

    // TODO: should we report the progress on this?
    const merkleRootsToBeFound = new Set<string>();
    const missingNotaryIds = new Set<string>(Object.keys(requiredTrustedNotaries));
    for (const notaryProof of this.storageService.getNotaryProofs()) {
      const notary = notaries.find((n) => n.id === notaryProof.name);
      if (!notary) {
        this.problems.push(`Found proof for unknown notary: ${notaryProof.name}`);
        continue;
      }

      missingNotaryIds.delete(notary.id);

      const proof = await notaryProof.json$;
      if (proof.ledgerId !== info.address) {
        this.problems.push(`Invalid ledger id in notary proof: expected ${info.address}, found ${proof.ledgerId}`);
        continue;
      }

      const notarizationSteps = proof.merkleConsistencyProofs.length;
      if (proof.pathHistory.length !== notarizationSteps) {
        this.problems.push(`Invalid notary proof: found ${proof.pathHistory.length} notarizations and ${notarizationSteps} merkle proofs`);
        continue;
      }

      const [digests, notaryErrors] = await this.notaryService.getDigests(notary);
      this.problems.push(...notaryErrors);

      const checker = await this.dotNet.makeNotaryChecker(proof.ledgerId);
      try {
        for (let i = 0; i < notarizationSteps; i++) {
          const problems = checker.checkConsistencyStep(proof.pathHistory[i], proof.merkleConsistencyProofs[i]);
          if (problems.length === 0) {
            // if the proof is valid, we should check that the notarized Merkle root
            // corresponds to one of the blocks of the ledger
            const merkleRootRaw = checker.getMerkleRoot();
            const merkleRoot = merkleRootRaw && u8ToBase64(merkleRootRaw);
            if (merkleRoot) {
              merkleRootsToBeFound.add(u8ToBase64(merkleRoot));
            }

            const expectedDigestRaw = checker.getExpectedDigest();
            const expectedDigest = expectedDigestRaw && u8ToBase64(expectedDigestRaw);
            if (!digests[i]) {
              this.problems.push(`Missing digest ${expectedDigest} on ${notary.id}`);
            } else if (expectedDigest !== digests[i]) {
              this.problems.push(`Invalid notary proof: expected digest ${expectedDigest}, found ${digests[i]}`);
            }
          } else {
            this.problems.push(...problems);
          }
        }

        this.problems.push(...checker.finishConsistencyCheck());
      } finally {
        checker.dispose();
      }
    }

    /**
     * Note: An export should have a notary proof for each notary in order to be considered trustworthy.
     */
    for (const missingNotaryId of missingNotaryIds) {
      this.problems.push(`Missing notarization proof for trusted notary: ${missingNotaryId}`);
    }

    try {
      for (let i = 0; i < totalBlocks; i++) {
        yield {
          checkedBlocks: i,
          totalBlocks,
        };

        const raw = await this.storageService.getRawBlock(i);
        if (raw) {
          const result = state.evaluate(raw.payload, raw.writeReceipt);
          if (result.merkleRootHash) {
            merkleRootsToBeFound.delete(u8ToBase64(result.merkleRootHash));
          }
          await this.dispatchBlock(i, result);
          this.problems.push(...result.problems.map((p) => formatValidationError(p, i)));
        } else {
          this.problems.push(`Missing block #${i}`);
        }
      }

      yield {
        checkedBlocks: totalBlocks,
        totalBlocks,
      };

      for (const merkleRoot of merkleRootsToBeFound) {
        this.problems.push(`The Merkle root ${merkleRoot} has been notarized but it has not been found in a block`);
      }

      this.archiveLoaded = true;

      if (this.problems.length) {
        throw new LedgerError(this.problems);
      }
    } finally {
      state.dispose();
    }
  }

  reset() {
    this.archiveLoaded = false;
    this.problems = [];
    this.reset$.next();
    this.acknowledgementService.reset();
    this.ledgerObjectsService.reset();
  }

  private async dispatchBlock(blockIndex: number, result: Ledger.Validator.EvaluationResult) {
    if (!result.block) {
      return;
    }

    let terminalBlock = result.block;
    while (isEncapsulation(terminalBlock)) {
      terminalBlock = terminalBlock.inner;
    }

    const validated: ValidatedBlock = {
      block: result.block,
      linkHash: result.linkHash,
      blockIndex,
      writeReceipt: result.writeReceipt,
      terminalBlock,
      getDecrypted: () => { throw new Error('Not a data block'); },
    };

    if (terminalBlock.type === 'Data') {
      const data = terminalBlock.data;
      let decrypted$: Promise<Uint8Array>;
      validated.getDecrypted = () => decrypted$ ??= this.storageService.decryptBlock(data, blockIndex);
    }

    await this.acknowledgementService.appendBlock(validated);
    await this.ledgerObjectsService.appendBlock(validated);
  }
}
