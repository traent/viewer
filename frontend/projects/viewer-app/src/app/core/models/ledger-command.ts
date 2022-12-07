export enum LedgerOperation {
  Add = 0,
  Update = 1,
  Remove = 2,
};

export type LedgerCommandRaw = [
  type: string,
  id: string,
  operation: LedgerOperation,
  fields: Record<string, Uint8Array>,
];
