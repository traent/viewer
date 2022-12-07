// https://stackoverflow.com/questions/57132428/augmentations-for-the-global-scope-can-only-be-directly-nested-in-external-modul
export {};

declare global {
  interface SymbolConstructor {
    readonly virtualHelpers: unique symbol;
  }
  interface Window {
    [Symbol.virtualHelpers]: {
      getVirtualUrl(relativeUrl: string): Promise<string>;
      getDocumentVirtualUrl(documentId: string, ledgerId?: string): Promise<string>;
    };
  }
}
