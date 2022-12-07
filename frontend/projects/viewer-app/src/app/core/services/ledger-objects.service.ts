import { Injectable } from '@angular/core';
import { decode } from '@msgpack/msgpack';
import { RedactedMarker } from '@traent/ngx-components';
import { last, required } from '@traent/ts-utils';
import { memoize } from '@viewer/utils';

import { ValidatedBlock } from './ledger.service';
import { StorageService } from './storage.service';
import {
  BlockIdentification,
  LedgerRawChange,
  LedgerCommandRaw,
  LedgerRawObject,
  LedgerResource,
  numToOperation,
} from '../models';
import { Ledger } from '../utils/ledger';

import { ChangeFilter, LedgerBlock, LedgerChange, LedgerHistoryInstant, LedgerObject, ObjectFilter, Page } from '*/well-known/view-v2.js';

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

type LedgerBlockState = {
  info: BlockIdentification & LedgerBlock;
  changes: LedgerRawChange[];
  state: Map<string, LedgerRawObject>;
  typeIndex: Map<string, Set<string>>;
};

type RichLedgerObject = LedgerObject & Record<'createdInBlock' | 'updatedInBlock', BlockIdentification>;
type CachedLedger = ReturnType<typeof makeCachedLedger>;

const resolveField = (ledger: Ledger) => async (hash: Uint8Array) => {
  const offchain = await ledger.getOffchain(hash);
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
    return decoded === null ? undefined : decoded;
  } else {
    // Note: if no offchain data is found, the field is considered to be redacted
    return RedactedMarker;
  }
};

const makeCachedLedger = (ledger: Ledger) => {
  const history: LedgerBlockState[] = [];
  const offchains = memoize(resolveField(ledger));

  const mapper = async (target: Record<string, Uint8Array>): Promise<Record<string, unknown>> =>
    Object.fromEntries(await Promise.all(Object.entries(target).map(async ([k, v]) => [k, await offchains(v)])));

  const resolveChange = memoize(async (raw: LedgerRawChange) => ({
    id: raw.id,
    type: raw.type,
    operation: raw.operation,
    block: history[raw.blockIndex].info,
    fields: await mapper(raw.fields),
  }));

  const resolveObject = memoize(async (raw: LedgerRawObject) => ({
    id: raw.id,
    type: raw.type,
    createdInBlock: history[raw.createdInBlock].info,
    updatedInBlock: history[raw.updatedInBlock].info,
    fields: await mapper(raw.fields),
  }));

  return { history, resolveChange, resolveObject };
};

const makeBlockState = (changes: LedgerRawChange[], info: BlockIdentification, previous?: LedgerBlockState): LedgerBlockState => {
  if (!changes.length) { // no changes -> shortcut
    return {
      info,
      changes,
      state: previous?.state ?? new Map(),
      typeIndex: previous?.typeIndex ?? new Map(),
    };
  }

  const prevTypeIndex = previous?.typeIndex;
  let typeIndex: Map<string, Set<string>> | undefined;
  const changeTypeIndex = (type: string) => {
    typeIndex ??= new Map(prevTypeIndex);
    const set = typeIndex.get(type);
    if (set === undefined || set === prevTypeIndex?.get(type)) {
      const newSet = new Set(set);
      typeIndex.set(type, newSet);
      return newSet;
    } else {
      return set;
    }
  };

  const state = new Map(previous?.state);
  const updatedInBlock = info.index;

  for (const change of changes) {
    const { id, type, fields, operation } = change;
    const prevObj = state.get(id);
    switch (operation) {
      case 'create': {
        if (prevObj) {
          throw new Error(`Creating an already existing object`);
        }
        const obj: LedgerRawObject = {
          id,
          type,
          fields,
          createdInBlock: updatedInBlock,
          updatedInBlock,
        };

        state.set(id, obj);
        changeTypeIndex(type).add(id);

        break;
      }

      case 'update': {
        if (!prevObj) {
          throw new Error(`Updating a non-existing object`);
        } else if (type !== prevObj.type) {
          throw new Error(`Updating an object of type ${type} but its type is ${prevObj.type}`);
        }

        const obj: LedgerRawObject = {
          id,
          type,
          fields: { ...prevObj.fields, ...fields },
          createdInBlock: prevObj.createdInBlock,
          updatedInBlock,
        };

        state.set(id, obj);
        // types are preserved

        break;
      }

      case 'delete': {
        if (!prevObj) {
          throw new Error(`Deleting a non-existing object`);
        } else if (type !== prevObj.type) {
          throw new Error(`Deleting an object of type ${type} but its type is ${prevObj.type}`);
        }

        state.delete(id);
        changeTypeIndex(type).delete(id);

        break;
      }
    }
  }

  return {
    info,
    changes,
    state,
    typeIndex: typeIndex ?? prevTypeIndex ?? new Map(),
  };
};

const getBlockIndex = (history: LedgerBlockState[], at?: LedgerHistoryInstant) => {
  if (typeof at === 'number' || typeof at === 'undefined') {
    return at;
  }

  const stringAt = typeof at === 'string' ? at : at.toISOString();
  const index = history.findIndex((block) => block.info.createdAt ?? '' >= stringAt);
  return index === -1 ? history.length : index;
};

const objToResource = (obj: RichLedgerObject): LedgerResource & Record<string, unknown> => ({
  ...obj.fields,
  id: obj.id,
  createdInBlock: obj.createdInBlock,
  updatedInBlock: obj.updatedInBlock,
  createdAt: obj.createdInBlock.writtenAt,
  updatedAt: obj.updatedInBlock.writtenAt,
});

@Injectable({ providedIn: 'root' })
export class LedgerObjectsService {
  private ledgers: Record<string, CachedLedger> = {};

  constructor(private readonly storageService: StorageService) { }

  async appendBlock({ ledgerId, blockIndex, linkHash, terminalBlock, getDecrypted, writeReceipt }: ValidatedBlock) {
    const { history } = this.ledgers[ledgerId] ??= makeCachedLedger(this.storageService.getLedger(ledgerId));
    if (history.length !== blockIndex) {
      console.warn(`Updating ledger state from block ${history.length - 1} to ${blockIndex}`);
      return;
    }

    const changes: LedgerRawChange[] = [];
    if (terminalBlock.type === 'Data') {
      // TODO: validate decoded payload instead of just assuming it is a command
      const commandLists: LedgerCommandRaw[][] = decode(await getDecrypted()) as any;
      for (const commands of commandLists) {
        for (const [type, id, operation, fields] of commands) {
          changes.push({
            type,
            id,
            operation: numToOperation[operation],
            fields,
            blockIndex,
          });
        }
      }
    }

    const info = {
      index: blockIndex,
      linkHash,
      createdAt: writeReceipt?.writtenAt, // FIXME: remove me
      writtenAt: writeReceipt?.writtenAt,
    };

    history.push(makeBlockState(changes, info, last(history)));
  }

  reset() {
    this.ledgers = {};
  }

  async getObjects(ledgerId: string, blockIndex = this.storageService.getLedger(ledgerId).getBlocksCount() - 1): Promise<LedgerState> {
    const state: LedgerState = {};

    const page = await this.getObjectsV2(ledgerId, { at: blockIndex });
    for (const obj of page.items) {
      const collection = state[obj.type] ??= {};
      collection[obj.id] = objToResource(obj);
    }

    return state;
  }

  async getObject(
    ledgerId: string,
    type: string,
    objId: string,
    blockIndex = this.storageService.getLedger(ledgerId).getBlocksCount() - 1,
  ): Promise<LedgerResource> {
    const page = await this.getObjectsV2(ledgerId, { type, id: objId, at: blockIndex });
    const obj = page.items[0];
    return objToResource(obj);
  }

  async getHistory(ledgerId: string, from = 0, to = this.storageService.getLedger(ledgerId).getBlocksCount() - 1) {
    const { history, resolveChange, resolveObject } = this.ledgers[ledgerId];

    const result: LedgerSnapshot[] = [];

    for (const block of history.slice(from, to + 1)) {
      const blockResources = new Map<string, LedgerResource>();
      for (const change of block.changes) {
        const { id, type, operation } = await resolveChange(change);
        const { fields } = await resolveChange(change);
        switch (operation) {
          case 'create': {
            const delta = objToResource({
              id: change.id,
              type: change.type,
              fields,
              createdInBlock: block.info,
              updatedInBlock: block.info,
            });
            blockResources.set(change.id, delta);

            result.push({
              id,
              type,
              delta,
              operation: 'creation',
              previous: undefined,
              createdInBlock: block.info,
              updatedInBlock: block.info,
            });
            break;
          }

          case 'update':
          case 'delete': {
            const delta = {
              ...fields,
              updatedAt: block.info.createdAt,
              updatedInBlock: block.info,
            };

            let previous;
            const blockObj = blockResources.get(change.id);
            if (blockObj) {
              previous = blockObj;
            } else {
              const prevObj = history[change.blockIndex - 1].state.get(change.id);
              required(prevObj);
              previous = objToResource(await resolveObject(prevObj));
            }
            blockResources.set(change.id, { ...previous, ...delta });

            result.push({
              id,
              type,
              delta,
              operation: operation === 'delete' ? 'deletion' : 'update',
              previous,
              createdInBlock: previous.createdInBlock,
              updatedInBlock: block.info,
            });
          }
        }
      }
    }

    return result;
  }

  async getChanges(ledgerId: string, filter: ChangeFilter): Promise<Page<LedgerChange>> {
    const { history, resolveChange } = this.ledgers[ledgerId];
    const from = getBlockIndex(history, filter.from) ?? 0;
    const to = getBlockIndex(history, filter.to) ?? (history.length - 1);

    const result: LedgerRawChange[] = [];

    const { type, id } = filter;
    for (const block of history.slice(from, to + 1)) {
      let changes = block.changes;
      changes = id === undefined ? changes : changes.filter((s) => s.id === id);
      changes = type === undefined ? changes : changes.filter((s) => s.type === type);
      result.push(...changes);
    }

    const page = {
      total: result.length,
      offset: filter.offset ?? 0,
      limit: filter.limit,
    };

    const end = filter.limit === undefined ? undefined : filter.limit + page.offset;

    const items$ = result
      .slice(page.offset, end)
      .map(resolveChange);

    return { page, items: await Promise.all(items$) };
  }

  async getObjectsV2(ledgerId: string, filter: ObjectFilter): Promise<Page<RichLedgerObject>> {
    const { history, resolveObject } = this.ledgers[ledgerId];
    const at = getBlockIndex(history, filter.at) ?? (history.length - 1);

    const result: LedgerRawObject[] = [];

    const { type, id } = filter;
    const block = history[at];
    if (id !== undefined) {
      const obj = block.state.get(id);
      if (obj && (type === undefined || type === obj.type)) {
        result.push(obj);
      }
    } else if (type !== undefined) {
      const objs = block.typeIndex.get(type);
      if (objs) {
        for (const objId of objs) {
          const obj = block.state.get(objId);
          if (obj) {
            result.push(obj);
          }
        }
      }
    } else {
      for (const obj of block.state.values()) {
        result.push(obj);
      }
    }

    const page = {
      total: result.length,
      offset: filter.offset ?? 0,
      limit: filter.limit,
    };

    const end = filter.limit === undefined ? undefined : filter.limit + page.offset;

    const items$ = result
      .slice(page.offset, end)
      .map(resolveObject);

    return { page, items: await Promise.all(items$) };
  }
}
