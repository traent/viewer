import { Injectable } from '@angular/core';
import { AcknowledgementStatus, Acknowledgement, BlockAcknowledgementInfo, LedgerPolicyV1 } from '@viewer/models';
import { base64ToU8, isEncapsulation, parsePolicyV1, u8ToBase64, u8ToBase64Url } from '@viewer/utils';
import { calculateJwkThumbprint } from 'jose';

import { DotNetWrapperService } from './dotnet-wrapper.service';
import { ValidatedBlock } from './ledger.service';

type AuthorAcknowledgements = Record<string, Acknowledgement[]>;
export type AcknowledgementByAuthor = Record<string, Acknowledgement | undefined>;
type AcknowledgementContext = {
  authorKeyIdMap: Record<string, string>;
  policy: LedgerPolicyV1;
  contextHeadIndex: number;
  state: AuthorAcknowledgements;
};

const getAck = (block: Ledger.Parser.Block) => block.type === 'Ack' ? block : undefined;

const isUpdatingContext = (block: Ledger.Parser.Block) => {
  while (isEncapsulation(block)) {
    if (block.type === 'UpdateContext') {
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
  private contextCollection: Record<string, AcknowledgementContext> = {};

  constructor(private readonly dotnet: DotNetWrapperService) { }

  private getState(ledgerId: string) {
    const state = this.contextCollection[ledgerId] && this.contextCollection[ledgerId].state;
    if (!state) {
      throw new Error('No state available');
    }

    return state;
  }

  async appendBlock({ ledgerId, block, blockIndex, terminalBlock }: ValidatedBlock) {
    if (block.type === 'Policy') {
      const policy = parsePolicyV1(block);
      this.contextCollection[ledgerId] = {
        authorKeyIdMap: {},
        state: {},
        contextHeadIndex: blockIndex,
        policy,
      };

      return await this.addAuthors(ledgerId, this.contextCollection[ledgerId], policy.AuthorKeys);
    }

    const context = this.contextCollection[ledgerId];
    const updatedContext = isUpdatingContext(block);
    if (updatedContext) {
      context.contextHeadIndex = blockIndex;
    }

    if (block.type === 'AuthorSignature') {
      const target = updatedContext ? blockIndex : getAck(terminalBlock)?.targetIndex;
      if (target !== undefined) {
        const authorId = u8ToBase64(block.authorId);
        const state = this.getState(ledgerId);
        const acks = state[authorId] ??= [];

        acks.push({
          blockIndex,
          targetBlock: target,
        });
      }
    }

    if (terminalBlock.type === 'AddAuthors') {
      await this.addAuthors(ledgerId, context, terminalBlock.authorKeys);
    }
  }

  private async addAuthors(ledgerId: string, context: AcknowledgementContext, authorKeys: Array<Uint8Array | string>) {
    const ledgerIdU8 = base64ToU8(ledgerId);
    for (const authorKey of authorKeys) {
      const [authorKeyThumbprint, authorId] = await Promise.all([
        getAuthorKeyThumbprint(authorKey),
        this.dotnet.computeHash(ledgerIdU8, context.policy.HashingAlgorithm, authorKey),
      ]);
      context.authorKeyIdMap[u8ToBase64(authorId)] = authorKeyThumbprint;
    }
  }

  reset() {
    this.contextCollection = {};
  }

  getAuthorKeyId(ledgerId: string, authorId: string): string | undefined {
    return this.contextCollection[ledgerId].authorKeyIdMap[authorId];
  }

  async getAcknowledgementStatus(ledgerId: string, blockIndex: number): Promise<BlockAcknowledgementInfo> {
    const lastAcknowledgementsList = Object.values(await this.getLatestAcknowledgements(ledgerId));
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

  async getAcknowledgements(ledgerId: string, blockIndex: number) {
    const state = this.getState(ledgerId);
    const result: AcknowledgementByAuthor = {};
    for (const authorId of Object.keys(state)) {
      const acknowledgements = state[authorId];
      const ack = acknowledgements.find(({ targetBlock }) => targetBlock >= blockIndex);
      result[authorId] = ack;
    }
    return result;
  }

  async getContextHead(ledgerId: string): Promise<number | undefined> {
    return this.contextCollection[ledgerId]?.contextHeadIndex;
  }

  async getLatestAcknowledgements(ledgerId: string) {
    const state = this.getState(ledgerId);
    const result: AcknowledgementByAuthor = {};
    for (const authorId of Object.keys(state)) {
      const acknowledges = state[authorId];
      result[authorId] = acknowledges[acknowledges.length - 1];
    }
    return result;
  }
}
