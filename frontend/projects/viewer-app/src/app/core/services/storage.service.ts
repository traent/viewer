import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { unzipRaw } from 'unzipit';

import { DotNetWrapperService } from './dotnet-wrapper.service';
import { LedgerBlockParseService } from './ledger-block-parse.service';
import {
  LedgerInfo,
  MissingExportVersionError,
  MissingLedgerExportError,
  UnsupportedVersionError,
  ZipEntry,
} from '../models';
import { b64ToB64UrlEncoding, createReader, Ledger, LedgerStorage } from '../utils';

const exportLedgerFilename = 'ledger.json';

// `LedgersIndex` is a data type that aims to link each `ledgerId` to its corresponding index inside the `ledgers` array
type LedgersIndex = Record<string, number>;
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
const parseLedgersMap = async (entries: ZipEntry[]): Promise<[number | undefined, LedgerStorageMap]> => {
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
    const ledgerId = b64ToB64UrlEncoding(manifestData.address);
    ledgersMap[ledgerId] = new LedgerStorage(version, manifestData, entries);
    return [0, ledgersMap];
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
      const ledgerId = b64ToB64UrlEncoding(address);
      ledgersMap[ledgerId] = new LedgerStorage(version, ledgerInfo, [manifest, ...ledgerEntries], dir);
    }

    return [manifestData.defaultLedger, ledgersMap];
  }

  throw new UnsupportedVersionError(version);
};

@Injectable({ providedIn: 'root' })
export class StorageService {
  private ledgers: Ledger[] = [];
  private ledgersIndex: LedgersIndex = {};
  archiveSize = 0;
  defaultLedger?: Ledger;
  exportName?: string;

  readonly ready$ = new Subject<void>();

  constructor(
    private readonly dotnet: DotNetWrapperService,
    private readonly parser: LedgerBlockParseService,
  ) { }

  async load(data: Blob | string, exportName: string): Promise<void> {
    this.reset();

    const dataReader = createReader(data);
    const zipInfo = await unzipRaw(dataReader);
    const [defaultIdx, map] = await parseLedgersMap(zipInfo.entries);
    for (const [index, [id, ledgerStorage]] of Object.entries(map).entries()) {
      this.ledgers = [...this.ledgers, new Ledger({ id, cryptoProvider: this.dotnet, blockParser: this.parser, ledgerStorage })];
      this.ledgersIndex[id] = index;
    }

    if (defaultIdx !== undefined) {
      this.defaultLedger = this.ledgers[defaultIdx];
    } else if (this.ledgers.length === 1) {
      this.defaultLedger = this.ledgers[0];
    }

    this.exportName = exportName;
    this.archiveSize = await dataReader.getLength();
    this.ready$.next();
  }

  getLedger(id: string) {
    if (id in this.ledgersIndex === false) {
      throw new Error(`Ledger ${id} not found`);
    }

    return this.ledgers[this.ledgersIndex[id]];
  }

  getLedgers() {
    return [...this.ledgers];
  }

  reset(): void {
    this.defaultLedger = undefined;
    this.exportName = undefined;
    this.archiveSize = 0;
    this.ledgers = [];
    this.ledgersIndex = {};
  }
}
