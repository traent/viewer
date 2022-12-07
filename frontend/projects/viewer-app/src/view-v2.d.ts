declare module '*/well-known/view-v2.js' {
  //#region definition of (reduced) Observable functionality
  interface Observable<T> {
    subscribe(observer: Partial<Observer<T>>): Unsubscribable;
  }

  interface Observer<T> {
    next: (value: T) => void;
    error: (err: any) => void;
    complete: () => void;
  }

  interface Unsubscribable {
    unsubscribe(): void;
  }
  //#endregion

  //#region handling of redacted data
  const redactedMarker: unique symbol;
  type RedactedType = typeof redactedMarker;

  export function isExported<T>(value: T): value is Exclude<T, RedactedType>;
  //#endregion

  //#region utility types

  // aliases to explain the expected format/meaning of simple data types
  type Base64UrlString = string;
  type Uuid = string;
  type ISOString = string;

  type BlockIndex = number;
  export type LedgerHistoryInstant = BlockIndex | Date | ISOString;

  // reusable page type
  export type Page<T> = {
    page: {
      offset: number;
      limit?: number;
      total: number;
    };
    items: T[];
  };

  //#endregion

  //#region Ledger

  // data definitions
  export type LedgerBlock = {
    index: BlockIndex;
    writtenAt?: ISOString;
  };

  export type Acknowledgement = LedgerBlock & {
    target: BlockIndex;
    authorId: Uint8Array;
  };

  export type LedgerObject = {
    id: Uuid;
    type: string;
    fields: Record<string, unknown>;
    createdInBlock: LedgerBlock;
    updatedInBlock: LedgerBlock;
  };

  export type LedgerChange = {
    id: Uuid;
    operation: 'create' | 'update' | 'delete';
    type: string;
    fields: Record<string, unknown>;
    block: LedgerBlock;
  };

  // filters
  type PageFilter = {
    offset?: number;
    limit?: number;
    // TODO: sort
  };

  type BlockFilter = PageFilter;
  type AckFilter = BlockFilter & {
    authorId?: Uint8Array;
  };

  export type ObjectFilter = PageFilter & {
    type?: string;
    id?: string;
    at?: LedgerHistoryInstant;
  };

  export type ChangeFilter = PageFilter & {
    type?: string;
    id?: string;
    from?: LedgerHistoryInstant;
    to?: LedgerHistoryInstant;
  };

  type RealtimeObjectFilter = {
    type: string;
    id: string;
    from?: LedgerHistoryInstant;
  };

  // Operations
  interface Ledger {
    // getAcknowledgements(filter: AckFilter): Promise<Page<Acknowledgement>>;
    // getAuthors(filter: AuthorFilter): Promise<Page<unknown>>;
    // getBlockInfo(filter: BlockFilter): Promise<Page<LedgerBlock>>;

    getObjects(filter: ObjectFilter): Promise<Page<LedgerObject>>;
    getChanges(filter: ChangeFilter): Promise<Page<LedgerChange>>;
    // observeObject(filter: RealtimeObjectFilter): Observable<LedgerChange>;
  }

  // main entry point to access ledgers
  export function getLedger(ledgerId?: Base64UrlString): Promise<Ledger>;

  //#endregion
}
