export class LedgerError extends Error {
  constructor(readonly problems: string[]) {
    super(`${problems.length} problems detected while validating the ledger`);
  }
}

export class NoAvailableDecryptionKeyError extends Error {
  constructor() {
    super('No key available');
  }
}

export class InvalidLedgerKeysError extends Error {
  constructor() {
    super('Ledger key and block key mismatch');
  }
}

export class MalformedLedgerError extends Error {
  constructor() {
    super('Malformed ledger');
  }
}

export class ExportInfoNotFoundError extends Error {
  constructor(infoFile: string) {
    super(`${infoFile} export info file not found`);
  }
}

export class LedgerBlockNotFoundError extends Error {
  constructor(blockNumber: number) {
    super(`Ledger block ${blockNumber} not found`);
  }
}

export class MalformedLedgerBlockError extends Error {
  constructor(blockNumber: number) {
    super(`Ledger block ${blockNumber} malformed`);
  }
}

export class LedgerBlockDecryptionError extends Error {
  constructor(blockNumber: number) {
    super(`Ledger block ${blockNumber} decryption failed`);
  }
}

export class LedgerBlockReadError extends Error {
  constructor(blockNumber: number) {
    super(`Ledger block ${blockNumber} read failed`);
  }
}

export class MissingLedgerExportError extends Error {
  constructor() {
    super('Unable to find a valid ledger.json file');
  }
}

export class MissingExportVersionError extends Error {
  constructor() {
    super('Unable to find a version for the export of the ledger');
  }
}

export class UnsupportedVersionError extends Error {
  constructor(version: number) {
    super(`Version ${version} is not supported`);
  }
}

export class InvalidEntryNameError extends Error {
  constructor(name: string) {
    super(`Invalid entry name: ${name}`);
  }
}
