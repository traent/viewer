import { Injectable } from '@angular/core';
import { LedgerError, requiredTrustedNotaries } from '@viewer/models';
import { isEncapsulation, Ledger, u8ToBase64 } from '@viewer/utils';
import { BehaviorSubject } from 'rxjs';

import { AcknowledgementService } from './acknowledgement.service';
import { DotNetWrapperService } from './dotnet-wrapper.service';
import { LedgerObjectsService } from './ledger-objects.service';
import { NotaryService } from './notary.service';
import { StorageService } from './storage.service';
import { formatValidationError } from '../utils/validation';

export interface ValidatedBlock {
  ledgerId: string;
  blockIndex: number;
  block: Ledger.Parser.Block;
  linkHash: Uint8Array;
  writeReceipt?: Ledger.Validator.WriteReceipt;
  terminalBlock: Ledger.Parser.TerminalBlock;
  getDecrypted(): Promise<Uint8Array>;
}

type LedgerValidationState = {
  problems: string[];
  warnings: string[];
};

type ExportValidationState = Record<string, LedgerValidationState>;

@Injectable({ providedIn: 'root' })
export class LedgerService {
  validationState: ExportValidationState = {};
  archiveLoaded = false;

  readonly reset$ = new BehaviorSubject<void>(undefined);

  get hasErrors() {
    return Object.values(this.validationState).some((el) => el.problems.length > 0);
  }

  get hasWarnings() {
    return Object.values(this.validationState).some((el) => el.warnings.length > 0);
  }

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dotNet: DotNetWrapperService,
    private readonly ledgerObjectsService: LedgerObjectsService,
    private readonly notaryService: NotaryService,
    private readonly storageService: StorageService,
  ) { }

  async *load(data: Blob | string, exportName: string) {
    this.reset();
    await this.storageService.load(data, exportName);

    const ledgers = this.storageService.getLedgers();
    const generators = ledgers.map((ledger) => this.evaluate(ledger));
    const ledgersProgress = await Promise.all(generators.map(async (gen) => (await gen.next()).value));

    for (const [idx, ledger] of generators.entries()) {
      for await (const progress of ledger) {
        ledgersProgress[idx] = progress;
        yield {
          checkedBlocks: ledgersProgress.reduce((p, n) => p + n.checkedBlocks, 0),
          totalBlocks: ledgersProgress.reduce((p, n) => p + n.totalBlocks, 0),
        };
      }
    }

    this.archiveLoaded = true;

    if (this.hasErrors) {
      throw new LedgerError();
    }
  }

  reset() {
    this.archiveLoaded = false;
    this.validationState = {};
    this.reset$.next();
    this.acknowledgementService.reset();
    this.ledgerObjectsService.reset();
  }

  private async checkNotaryProofs(ledger: Ledger, address: string) {
    const notaries = await ledger.getNotaries();

    const problems = [];
    const warnings = [];

    // TODO: should we report the progress on this?
    const merkleRootsToBeFound = new Set<string>();
    const missingNotaryIds = new Set<string>(Object.keys(requiredTrustedNotaries));
    for (const notaryProof of ledger.getNotaryProofs()) {
      const notary = notaries.find((n) => n.id === notaryProof.name);
      if (!notary) {
        warnings.push(`Found proof for unknown notary: ${notaryProof.name}`);
        continue;
      }

      missingNotaryIds.delete(notary.id);

      const proof = await notaryProof.json$;
      if (proof.ledgerId !== address) {
        problems.push(`Invalid ledger id in notary proof: expected ${address}, found ${proof.ledgerId}`);
        continue;
      }

      const notarizationSteps = proof.merkleConsistencyProofs.length;
      if (proof.pathHistory.length !== notarizationSteps) {
        problems.push(`Invalid notary proof: found ${proof.pathHistory.length} notarizations and ${notarizationSteps} merkle proofs`);
        continue;
      }

      const notaryData = await this.notaryService.getDigests(notary);
      if (notaryData.problems) {
        problems.push(...notaryData.problems);
        continue;
      }

      const checker = await this.dotNet.makeNotaryChecker(proof.ledgerId);
      try {
        for (let i = 0; i < notarizationSteps; i++) {
          const notarizationProblems = checker.checkConsistencyStep(proof.pathHistory[i], proof.merkleConsistencyProofs[i]);
          if (notarizationProblems.length === 0) {
            // if the proof is valid, we should check that the notarized Merkle root
            // corresponds to one of the blocks of the ledger
            const merkleRoot = checker.getMerkleRoot();
            if (merkleRoot) {
              merkleRootsToBeFound.add(u8ToBase64(merkleRoot));
            }

            const expectedDigestRaw = checker.getExpectedDigest();
            const expectedDigest = expectedDigestRaw && u8ToBase64(expectedDigestRaw);
            if (!notaryData.digests[i]) {
              problems.push(`Missing digest ${expectedDigest} on ${notary.id}`);
            } else if (expectedDigest !== notaryData.digests[i]) {
              problems.push(`Invalid notary proof: expected digest ${expectedDigest}, found ${notaryData.digests[i]}`);
            }
          } else {
            problems.push(...notarizationProblems);
          }
        }

        problems.push(...checker.finishConsistencyCheck());
      } finally {
        checker.dispose();
      }
    }

    /**
     * Note: An export should have a notary proof for each notary in order to be considered trustworthy.
     */
    for (const missingNotaryId of missingNotaryIds) {
      problems.push(`Missing notarization proof for trusted notary: ${missingNotaryId}`);
    }

    return { merkleRootsToBeFound, problems, warnings };
  }

  private async *evaluate(ledger: Ledger) {
    const info = await ledger.getLedgerInfo();
    const notaryChecks$ = this.checkNotaryProofs(ledger, info.address);
    const totalBlocks = info.headIndex + 1;
    yield { checkedBlocks: 0, totalBlocks };

    const problems = [];
    const warnings = [];

    const merkleRoots: string[] = [];
    const state = await this.dotNet.makeValidator(info.address);
    try {
      for (let i = 0; i < totalBlocks; i++) {
        const raw = await ledger.getRawBlock(i);
        if (raw) {
          const result = state.evaluate(raw.payload, raw.writeReceipt);
          if (result.merkleRootHash) {
            merkleRoots.push(u8ToBase64(result.merkleRootHash));
          }
          await this.dispatchBlock(ledger, i, result);
          problems.push(...result.problems.map((p) => formatValidationError(p, i)));
        } else {
          problems.push(`Missing block #${i}`);
        }
        yield { checkedBlocks: i + 1, totalBlocks };
      }
    } finally {
      state.dispose();
    }

    const notaryChecks = await notaryChecks$;
    problems.push(...notaryChecks.problems);
    warnings.push(...notaryChecks.warnings);

    let inFlightBlocks = 0;
    for (const merkleRoot of merkleRoots) {
      if (notaryChecks.merkleRootsToBeFound.delete(merkleRoot)) {
        inFlightBlocks = 0;
      } else {
        inFlightBlocks++;
      }
    }

    if (inFlightBlocks) {
      warnings.push(`${inFlightBlocks} blocks have not been notarized yet`);
    }

    for (const merkleRoot of notaryChecks.merkleRootsToBeFound) {
      problems.push(`The Merkle root ${merkleRoot} has been notarized but it has not been found in a block`);
    }

    this.validationState[ledger.id] = { warnings, problems };
    return { checkedBlocks: totalBlocks, totalBlocks };
  }

  private async dispatchBlock(ledger: Ledger, blockIndex: number, result: Ledger.Validator.EvaluationResult) {
    if (!result.block) {
      return;
    }

    let terminalBlock = result.block;
    while (isEncapsulation(terminalBlock)) {
      terminalBlock = terminalBlock.inner;
    }

    const validated: ValidatedBlock = {
      ledgerId: ledger.id,
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
      validated.getDecrypted = () => decrypted$ ??= ledger.decryptBlock(data, blockIndex);
    }

    await this.acknowledgementService.appendBlock(validated);
    await this.ledgerObjectsService.appendBlock(validated);
  }
}
