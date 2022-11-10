import { Injectable } from '@angular/core';
import { decode } from '@msgpack/msgpack';
import { RedactedMarker } from '@traent/ngx-components';
import { flatten, last } from '@traent/ts-utils';

import { BlockIdentification, LedgerCommand, LedgerCommandRaw, LedgerOperation, LedgerResource } from '../models';
import { ValidatedBlock } from './ledger.service';
import { StorageService } from './storage.service';

export type LedgerSnapshot = {
  id: string;
  type: string;
  delta: Partial<Record<string, unknown>>;
  updatedInBlock: BlockIdentification;
  createdInBlock: BlockIdentification;
} & ({
  operation: 'creation';
  previous: undefined;
  delta: LedgerResource;
} | {
  operation: 'update' | 'deletion';
  previous: LedgerResource;
});

export type LedgerCollection = Record<string, LedgerResource>;
export type LedgerState = Record<string, LedgerCollection>;
export type LedgerHistory = LedgerSnapshot[][];
export type ObjectHistory = LedgerSnapshot[];

const evaluateCommand = async (state: LedgerState, command: LedgerCommand, block: BlockIdentification): Promise<LedgerSnapshot> => {
  const delta = {
    ...await command.getFields(),
    updatedAt: block.createdAt,
    updatedInBlock: block,
  };
  switch (command.operation) {
    case 'Add':
      const updatedDelta = {
        ...delta,
        id: command.id,
        createdAt: block.createdAt,
        createdInBlock: block,
      };
      state[command.type] ||= {};
      state[command.type] = {
        ...state[command.type],
        [command.id]: updatedDelta,
      };
      return {
        id: command.id,
        type: command.type,
        delta: updatedDelta,
        operation: 'creation',
        previous: undefined,
        createdInBlock: block,
        updatedInBlock: block,
      };

    case 'Remove': {
      const previous = state[command.type][command.id];
      const { [command.id]: _deleted, ...newState } = state[command.type];
      state[command.type] = newState;
      return {
        id: command.id,
        type: command.type,
        delta,
        operation: 'deletion',
        previous,
        createdInBlock: previous.createdInBlock,
        updatedInBlock: block,
      };
    }

    case 'Update': {
      const previous = state[command.type][command.id];
      state[command.type] = {
        ...state[command.type],
        [command.id]: {
          ...previous,
          ...delta,
        },
      };
      return {
        id: command.id,
        type: command.type,
        delta,
        operation: 'update',
        previous,
        createdInBlock: previous.createdInBlock,
        updatedInBlock: block,
      };
    }
  }
};

@Injectable({ providedIn: 'root' })
export class LedgerObjectsService {
  private cachedState: Array<{
    changes: LedgerSnapshot[];
    state: LedgerState;
  }> = [];

  constructor(private readonly storageService: StorageService) { }

  private async getCommands(payload: Uint8Array): Promise<LedgerCommand[][]> {
    // TODO: validate decoded payload instead of just assuming it is a command
    const commandLists: LedgerCommandRaw[][] = decode(payload) as any;
    return commandLists.map((cmds) => cmds.map(([type, id, operation, fields]: LedgerCommandRaw): LedgerCommand => ({
      type,
      id,
      operation: LedgerOperation[operation] as any,
      fields,
      getFields: async () => {
        const f: Record<string, unknown> = {};
        await Promise.all(Object.entries(fields).map(async ([name, hash]) => {
          const offchain = await this.storageService.getOffchain(hash);
          if (offchain) {
            /**
             * Important: every nullable ledger object field has `undefined` as initial value.
             * If a block explicitly "unset" a field value, instead, it's value is set to `null` since
             * `undefined` does not belong to msgpack types domain.
             * https://github.com/msgpack/msgpack/blob/master/spec.md#nil-format
             *
             * We need to explicitly substitute any `null` field values for `undefined` in order
             * to avoid differences between models definition and runtime types.
             */
            const decoded = decode(await offchain.getDecrypted());
            f[name] = decoded === null ? undefined : decoded;
          } else {
            // Note: if no offchain data is found, the field is considered to be redacted
            f[name] = RedactedMarker;
          }
        }));
        return f;
      },
    })));
  }

  async appendBlock({ blockIndex, linkHash, terminalBlock, getDecrypted, writeReceipt }: ValidatedBlock) {
    if (this.cachedState.length !== blockIndex) {
      console.warn(`Updating ledger state from block ${this.cachedState.length - 1} to ${blockIndex}`);
      return;
    }

    const evaluatedState = { ...last(this.cachedState)?.state };
    const snapshots: LedgerSnapshot[] = [];
    if (terminalBlock.type === 'Data') {
      const commands = await this.getCommands(await getDecrypted());
      for (const command of flatten(commands)) {
        const blockIdentification = {
          index: blockIndex,
          linkHash,
          createdAt: writeReceipt?.writtenAt,
        };
        snapshots.push(await evaluateCommand(evaluatedState, command, blockIdentification));
      }
    }

    this.cachedState.push({
      changes: snapshots,
      state: evaluatedState,
    });
  }

  reset() {
    this.cachedState = [];
  }

  async getObjects(blockIndex = this.storageService.getBlocksCount() - 1): Promise<LedgerState> {
    return this.cachedState[blockIndex].state;
  }

  async getObject(type: string, id: string, blockIndex = this.storageService.getBlocksCount() - 1): Promise<LedgerResource> {
    return this.cachedState[blockIndex].state[type][id];
  }

  async getObjectHistory(type: string, id: string, from?: number, to = this.storageService.getBlocksCount() - 1): Promise<ObjectHistory> {
    return this.cachedState.slice(from, to + 1)
      .map((block) => block.changes.find((change) => change.type === type && change.id === id))
      .filter((change): change is LedgerSnapshot => !!change);
  }

  async getHistory(from = 0, to = this.storageService.getBlocksCount() - 1): Promise<LedgerHistory> {
    return this.cachedState.slice(from, to + 1).map((block) => block.changes);
  }
}
