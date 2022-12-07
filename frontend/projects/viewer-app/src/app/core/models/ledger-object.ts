import { LedgerOperation } from './ledger-command';

export const numToOperation = {
  [LedgerOperation.Add]: 'create',
  [LedgerOperation.Update]: 'update',
  [LedgerOperation.Remove]: 'delete',
} as const;

type Uuid = string;
type BlockIndex = number;

export type LedgerRawObject = {
  id: Uuid;
  type: string;
  fields: Record<string, Uint8Array>;
  createdInBlock: BlockIndex;
  updatedInBlock: BlockIndex;
};

export type LedgerRawChange = {
  id: Uuid;
  operation: 'create' | 'update' | 'delete';
  type: string;
  fields: Record<string, Uint8Array>;
  blockIndex: BlockIndex;
};
