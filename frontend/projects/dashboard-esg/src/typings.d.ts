declare module '*/well-known/view-v1.js' {
  interface ContainerApi {
    navigateByUrl: (url: string) => Promise<void>;
  }

  interface LedgerContext {
    getAcknowledgements: (blockIndex: number) => Promise<Record<string, any | undefined>>;
    getAll: (type: string) => Promise<any[]>;
    getAuthorKeyId: (authorId: string) => Promise<string | undefined>;
    getBlockIdentification: (blockIndex: number) => Promise<any>;
    getLatestAcknowledgements: () => Promise<Record<string, any | undefined>>;
    retrieve: (id: string) => Promise<any>;
  }

  export const ledgerContext: LedgerContext;
  export const containerApi: ContainerApi;
}
