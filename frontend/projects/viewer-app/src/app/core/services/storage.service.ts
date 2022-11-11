import { Injectable } from '@angular/core';
import { unzipRaw } from 'unzipit';

import {
  LedgerInfo,
  MissingExportVersionError,
  MissingLedgerExportError,
  UnsupportedVersionError,
  ZipEntry,
} from '../models';
import { createReader, Ledger, LedgerStorage } from '../utils';
import { DotNetWrapperService } from './dotnet-wrapper.service';
import { LedgerBlockParseService } from './ledger-block-parse.service';

const exportLedgerFilename = 'ledger.json';

// NOTE: this is a <ledgerId, ledger> map that will allow us to access the ledger by its id (in the future there will be more than one)
type LedgersMap = Record<string, Ledger>;
type LedgerStorageMap = Record<string, LedgerStorage>;

// IMPORTANT: this is the core function that needs to:
// 1 - understand which ledger export is being processed (ledger.json -> version): 0 -> single ledger, 1 -> multi-ledger
//     Note: `ledger.json` IS the manifest and it's always TOP LEVEL!
// 2 - parse the content by its version
// 3 - use a getter to retrieve a "default" ledger (this will help us in keeping the current version of the viewer full working).
//     I've used a `getter` for simplicity, but a more advanced mechanism will be required.
//
// Note: the `ledger.json`'s ledgers change from version 0 to version 1, so we need to implement two different interfaces
// in particular
const parseLedgersMap = async (entries: ZipEntry[]): Promise<LedgerStorageMap> => {
  const ledgersMap: LedgerStorageMap = {};
  const manifest = entries.find((e) => e.name === exportLedgerFilename);
  if (!manifest) {
    throw new MissingLedgerExportError();
  }

  const manifestData: any = await manifest.json();
  const version: number | undefined = manifestData.version;
  if (version == null) {
    throw new MissingExportVersionError();
  }

  if (version === 0) {
    // In v0, ledgerInfo has the same information contained in ledger.json
    ledgersMap[manifestData.address] = new LedgerStorage(version, manifestData, entries);
    return ledgersMap;
  }

  if (version === 1) {
    // TODO: Improve typing
    const ledgers: Map<string, any> = new Map(Object.entries(manifestData.ledgers || []));
    for (const ledger of ledgers) {
      const dir = `${ledger[0]}/`;
      const value = ledger[1];
      const { address, headIndex } = value;
      // Note: the zip entries are listed with their full path, so we need to parse them
      const ledgerEntries = entries.filter((entry) => entry.name.startsWith(dir));
      const ledgerInfo: LedgerInfo = {
        address,
        createdAt: manifestData.createdAt,
        headIndex,
        version: manifestData.version,
      };
      ledgersMap[address] = new LedgerStorage(version, ledgerInfo, [manifest, ...ledgerEntries], dir);
    }

    return ledgersMap;
  }

  throw new UnsupportedVersionError(version);
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  ledgersMap: LedgersMap = {};

  constructor(
    private readonly dotnet: DotNetWrapperService,
    private readonly parser: LedgerBlockParseService,
  ) { }

  async load(data: Blob | string): Promise<void> {
    const zipInfo = await unzipRaw(createReader(data));
    const map = await parseLedgersMap(zipInfo.entries);
    this.ledgersMap = Object.fromEntries(Object.entries(map).map(([k, v]) => [
      k,
      new Ledger({ cryptoProvider: this.dotnet, blockParser: this.parser, ledgerStorage: v }),
    ]));
  }

  getLedger() {
    /**
     * Note: this is a temporary solution.
     * This will need to change to use an explicit ledger ID instead.
     */
    const id = Object.keys(this.ledgersMap)[0];
    if (id in this.ledgersMap === false) {
      throw new Error(`Ledger ${id} not found`);
    }

    return this.ledgersMap[id];
  }

  reset(): void {
    this.ledgersMap = {};
  }
}
