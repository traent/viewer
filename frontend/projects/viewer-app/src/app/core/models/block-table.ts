export interface BlockIdentification {
  index: number;
  linkHash: Uint8Array;
  createdAt?: string;
}

export interface BlockItem extends BlockIdentification {
  size: number;
  encapsulations: Ledger.Parser.EncapsulationBlockType[];
  blockType?: Ledger.Parser.TerminalBlockType;
  merkleTreeRoot: Uint8Array;
  hasKey: boolean;

  getRaw(): Promise<Uint8Array>;
  getParsed(): Promise<Ledger.Parser.Block>;
  getDecrypted(): Promise<Uint8Array>;
}

export interface OffchainItem {
  hash: Uint8Array;
  size: number;
  hasKey: boolean;

  getRaw(): Promise<Uint8Array>;
  getDecrypted(): Promise<Uint8Array>;
}

export interface LedgerInfo {
  address: string;
  headIndex: number;
  createdAt: string;
  version: number;
}

export interface InchainKeyItem {
  index: number;
  key: Uint8Array;

  hasValidReference(): boolean;
}

export interface OffchainKeyItem {
  hash: string;
  key: Uint8Array;

  hasValidReference(): boolean;
}

export interface KeyPair {
  keyId: string;
  keyType: string;
  curve: string;
  publicKey: string;
  secretKey: string;
  createdAt: string;
}

export interface LedgerPolicyV1 {
  LedgerPublicKey: string;
  MaxBlockSize: number;
  HashingAlgorithm: string;
  SigningAlgorithm: string;
  AllowedBlocks: string[];
  AuthorKeys: string[];
  ApplicationData: {
    Encryption: string;
    Serialization: string;
    Version: string;
  };
}

// Note: these enums/interface could be auto-generated from the orgnode OpenApi spec
export enum LedgerExportResourceMode {
  All = 'all',
  None = 'none'
}

export enum LedgerExportWorkflowMode {
  AllStatuses = 'allStatuses',
  CurrentStatusOnly = 'currentStatusOnly'
}

export enum LedgerExportResourceVersion {
  AllVersions = 'allVersions',
  CurrentVersionOnly = 'currentVersionOnly'
}

export enum LedgerExportKeyMode {
  KeyPair = 'keyPair',
  BlockKeys = 'blockKeys',
  None = 'none'
}

export interface ExportRequest {
  collaboratorMode: LedgerExportResourceMode;
  defaultPage?: string;
  deletedDocuments: boolean;
  deletedStreams: boolean;
  documentMode: LedgerExportResourceMode;
  documentVersion: LedgerExportResourceVersion;
  exceptCollaborators: Array<string>;
  exceptDocuments: Array<string>;
  exceptStreams: Array<string>;
  exceptThreads: Array<string>;
  isFullExport: boolean;
  keyMode: LedgerExportKeyMode;
  streamMode: LedgerExportResourceMode;
  streamReferences: boolean;
  streamVersion: LedgerExportResourceVersion;
  name?: string;
  threadMode: LedgerExportResourceMode;
  threadReferences: boolean;
  workflowMode: LedgerExportWorkflowMode;
}

interface EncapsulationName {
  shortName: string;
  fullName: string;
}

export const blockEncapsulation: Record<Ledger.Parser.TerminalBlockType | Ledger.Parser.EncapsulationBlockType, EncapsulationName> = {
  Policy: {
    fullName: 'i18n.BlockTable.policy',
    shortName: 'G',
  },
  AuthorSignature: {
    fullName: 'i18n.BlockTable.authorSignature',
    shortName: 'S',
  },
  InContext: {
    fullName: 'i18n.BlockTable.inContext',
    shortName: 'C',
  },
  Data: {
    fullName: 'i18n.BlockTable.data',
    shortName: 'D',
  },
  Ack: {
    fullName: 'i18n.BlockTable.ack',
    shortName: 'K',
  },
  AddAuthors: {
    fullName: 'i18n.BlockTable.addAuthors',
    shortName: 'A',
  },
  Reference: {
    fullName: 'i18n.BlockTable.reference',
    shortName: 'R',
  },
  UpdateContext: {
    fullName: 'i18n.BlockTable.updateContext',
    shortName: 'U',
  },
  PreviousBlock: {
    fullName: 'i18n.BlockTable.previousBlock',
    shortName: 'P',
  },
};
