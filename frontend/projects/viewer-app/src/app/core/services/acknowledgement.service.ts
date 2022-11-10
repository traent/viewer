import { Injectable } from '@angular/core';
import { AcknowledgementStatus, Acknowledgement, BlockAcknowledgementInfo, LedgerPolicyV1 } from '@viewer/models';
import { b64ToB64UrlEncoding, parsePolicyV1, u8ToBase64, u8ToBase64Url } from '@viewer/utils';
import { calculateJwkThumbprint } from 'jose';

import { DotNetWrapperService } from './dotnet-wrapper.service';
import { ValidatedBlock } from './ledger.service';
import { isEncapsulation } from './storage.service';

type AuthorAcknowledgements = Record<string, Acknowledgement[]>;

const getAck = (block: Ledger.Parser.Block) => block.type === 'Ack' ? block : undefined;

const isInContext = (block: Ledger.Parser.Block) => {
  while (isEncapsulation(block)) {
    if (block.type === 'InContext') {
      return true;
    }
    block = block.inner;
  }
  return false;
};

const getAuthorKeyThumbprint = async (key: Uint8Array | string): Promise<string> => {
  const b64Key = u8ToBase64Url(key);
  const jwkThumbprint = await calculateJwkThumbprint({
    crv: 'Ed25519',
    kty: 'OKP',
    x: b64Key,
  },
    'sha512',
  );
  return jwkThumbprint;
};

@Injectable({ providedIn: 'root' })
export class AcknowledgementService {
  private state?: AuthorAcknowledgements;
  private authorKeyIdMap: Record<string, string> = {};
  private policy?: LedgerPolicyV1;
  private ledgerId?: Uint8Array;

  constructor(private readonly dotnet: DotNetWrapperService) { }

  private getState() {
    if (!this.state) {
      throw new Error('No state available');
    }

    return this.state;
  }

  async appendBlock({ block, blockIndex, terminalBlock }: ValidatedBlock) {
    if (blockIndex === 0) {
      this.state = {};
    }

    if (block.type === 'AuthorSignature') {
      const target = isInContext(block) ? blockIndex : getAck(terminalBlock)?.targetIndex;
      if (target !== undefined) {
        const authorId = u8ToBase64(block.authorId);
        const state = this.getState();
        const acks = state[authorId] ??= [];

        acks.push({
          blockIndex,
          targetBlock: target,
        });
      }
    } else if (block.type === 'Policy') {
      this.policy = parsePolicyV1(block);
      this.ledgerId = await this.dotnet.compuleLedgerId(this.policy.LedgerPublicKey);

      await this.addAuthors(this.policy.AuthorKeys);
    }

    if (terminalBlock.type === 'AddAuthors') {
      await this.addAuthors(terminalBlock.authorKeys);
    }
  }

  private async addAuthors(authorKeys: Array<Uint8Array | string>) {
    if (!this.policy) {
      throw new Error('Policy missing during authors key id generation');
    }

    if (!this.ledgerId) {
      throw new Error('Ledger id missing during authors key id generation');
    }

    for (const authorKey of authorKeys) {
      const [authorKeyThumbprint, authorId] = await Promise.all([
        getAuthorKeyThumbprint(authorKey),
        this.dotnet.computeHash(this.ledgerId, this.policy.HashingAlgorithm, authorKey),
      ]);
      this.authorKeyIdMap[u8ToBase64Url(authorId)] = authorKeyThumbprint;
    }
  }

  reset() {
    this.authorKeyIdMap = {};
    this.ledgerId = undefined;
    this.policy = undefined;
    this.state = undefined;
  }

  getAuthorKeyId(authorId: string): string | undefined {
    return this.authorKeyIdMap[b64ToB64UrlEncoding(authorId)];
  }

  async getAcknowledgementStatus(blockIndex: number): Promise<BlockAcknowledgementInfo> {
    const lastAcknowledgementsList = Object.values(await this.getLatestAcknowledgements());
    const receivedAcknowledgements = lastAcknowledgementsList
      .filter((acknowledge) => acknowledge !== undefined && acknowledge.targetBlock >= blockIndex)
      .length;

    return {
      status: receivedAcknowledgements === lastAcknowledgementsList.length
        ? AcknowledgementStatus.COMPLETE
        : receivedAcknowledgements === 0
          ? AcknowledgementStatus.NONE
          : AcknowledgementStatus.PARTIAL,
      total: lastAcknowledgementsList.length,
      acknowledged: receivedAcknowledgements,
    };
  }

  async getAcknowledgements(blockIndex: number) {
    const state = this.getState();
    const result: Record<string, Acknowledgement | undefined> = {};
    for (const authorId of Object.keys(state)) {
      const acknowledgements = state[authorId];
      const ack = acknowledgements.find(({ targetBlock }) => targetBlock >= blockIndex);
      result[authorId] = ack;
    }
    return result;
  }

  async getLatestAcknowledgements() {
    const state = this.getState();
    const result: Record<string, Acknowledgement | undefined> = {};
    for (const authorId of Object.keys(state)) {
      const acknowledges = state[authorId];
      result[authorId] = acknowledges[acknowledges.length - 1];
    }
    return result;
  }
}
