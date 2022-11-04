import { Injectable } from '@angular/core';
import { unzipRaw } from 'unzipit';

import {
  BlockIdentification,
  BlockItem,
  ExportRequest,
  InchainKeyItem,
  InvalidEntryNameError,
  InvalidLedgerKeysError,
  KeyPair,
  LedgerBlockDecryptionError,
  LedgerBlockNotFoundError,
  LedgerBlockReadError,
  LedgerInfo,
  MalformedLedgerBlockError,
  MalformedLedgerError,
  MissingExportVersionError,
  MissingLedgerExportError,
  NoAvailableDecryptionKeyError,
  Notarization,
  Notary,
  OffchainItem,
  OffchainKeyItem,
  UnsupportedVersionError,
} from '../models';
import { base64ToU8, createReader, emptyU8, hexToU8, parsePolicyV1, u8ToBase64, u8ToHex } from '../utils';
import { DotNetWrapperService } from './dotnet-wrapper.service';
import { LedgerBlockParseService } from './ledger-block-parse.service';

interface ZipEntry {
  blob(type?: string): Promise<Blob>;
  arrayBuffer(): Promise<ArrayBuffer>;
  text(): Promise<string>;
  json(): Promise<unknown>;
  name: string;
  size: number;
}

interface Block {
  linkHash: string;
  merkleTreeRoot: string;
  payload: string;
  writeReceipt: string;
}

// NOTE: these fields are serialized with PascalCase names by the vault
interface WriteReceipt {
  Ledger: string;
  Hash: string;
  MerkleRoot: string;
  WrittenAt: string;
}

export interface NotaryProof {
  ledgerId: string;
  iteration: number;
  pathHistory: string[][];
  merkleConsistencyProofs: string[];
  merkleRoot: string;
}

const exportLedgerFilename = 'ledger.json';
const exportInchainSharedKeysPrefix = 'sharedkeys/blocks/';
const exportOffchainSharedKeysPrefix = 'sharedkeys/offchain/';
const exportSharedInchainKeysSuffix = '.json.key';
const exportSharedOffchainKeysSuffix = '.key';
const exportRequestFilename = 'export_request.json';
const exportKeyPairFilename = 'keypair.json';
const exportInchainPrefix = 'blocks/';
const exportInchainSuffix = '.json';
const exportOffchainPrefix = 'offchain/';
const exportNotaryProofsPrefix = 'notaryproofs/';

const vaultKeyLength = 32;
const vaultSignatureLength = 64;

// NOTE: this is a <ledgerId, ledger> map that will allow us to access the ledger by its id (in the future there will be more than one)
type LedgersMap = Record<string, LedgerStorage>;

// IMPORTANT: this is the core function that needs to:
// 1 - understand which ledger export is being processed (ledger.json -> version): 0 -> single ledger, 1 -> multi-ledger
//     Note: `ledger.json` IS the manifest and it's always TOP LEVEL!
// 2 - parse the content by its version
// 3 - use a getter to retrieve a "default" ledger (this will help us in keeping the current version of the viewer full working).
//     I've used a `getter` for simplicity, but a more advanced mechanism will be required.
//
// Note: the `ledger.json`'s ledgers change from version 0 to version 1, so we need to implement two different interfaces
// in particular
const parseLedgersMap = async (entries: ZipEntry[]): Promise<LedgersMap> => {
  const ledgersMap: LedgersMap = {};
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

class LedgerStorage {
  ledgerPublicKey$?: Promise<Uint8Array>;

  readonly ledgerSecretKey$?: Promise<Uint8Array>;
  readonly blocks = new Map<number, ZipEntry>();
  readonly offchain = new Map<string, ZipEntry>();
  readonly notaryProofs = new Map<string, ZipEntry>();
  readonly other = new Map<string, ZipEntry>();
  readonly inchainKeys = new Map<number, ZipEntry>();
  readonly offchainKeys = new Map<string, ZipEntry>();
  readonly exportRequest?: ZipEntry;
  readonly keyPair?: ZipEntry;
  readonly size: number = 0;

  constructor(
    readonly version: number,
    readonly info: LedgerInfo,
    entries: ZipEntry[],
    readonly entryNamePrefix = '',
  ) {
    let size = 0;
    for (const entry of entries) {
      const isManifest = entry.name === exportLedgerFilename;
      if (!entry.name.startsWith(entryNamePrefix) && !isManifest) {
        throw new InvalidEntryNameError(entry.name);
      }

      const entryName = isManifest ? entry.name : entry.name.substring(entryNamePrefix.length);

      if (entryName.startsWith(exportOffchainPrefix)) {
        const hash = entryName.substring(exportOffchainPrefix.length);
        this.offchain.set(hash, entry);
      } else if (entryName.startsWith(exportInchainPrefix) && entryName.endsWith(exportInchainSuffix)) {
        const index = parseInt(
          entryName.substring(exportInchainPrefix.length, entryName.length - exportInchainSuffix.length),
          10,
        );
        this.blocks.set(index, entry);
      } else if (entryName.startsWith(exportNotaryProofsPrefix)) {
        this.notaryProofs.set(extractNotaryName(entryName), entry);
      } else if (entryName.startsWith(exportInchainSharedKeysPrefix) && entryName.endsWith(exportSharedInchainKeysSuffix)) {
        const index = parseInt(
          entryName.substring(
            exportInchainSharedKeysPrefix.length,
            entryName.length - exportSharedInchainKeysSuffix.length,
          ),
          10,
        );
        this.inchainKeys.set(index, entry);
      } else if (entryName.startsWith(exportOffchainSharedKeysPrefix) && entryName.endsWith(exportSharedOffchainKeysSuffix)) {
        const hash = entryName.substring(
          exportOffchainSharedKeysPrefix.length,
          entryName.length - exportSharedOffchainKeysSuffix.length,
        );
        this.offchainKeys.set(hash, entry);
      } else if (entryName === exportRequestFilename) {
        this.exportRequest = entry;
      } else if (entryName === exportKeyPairFilename) {
        this.keyPair = entry;
        const rawKeyPair$: Promise<any> = entry.json();
        const keyPair$: Promise<KeyPair> = rawKeyPair$; // TODO: validate json content
        this.ledgerSecretKey$ = keyPair$.then((k) => base64ToU8(k.secretKey));
        this.ledgerPublicKey$ = keyPair$.then((k) => base64ToU8(k.publicKey));
      } else {
        this.other.set(entryName, entry);
      }

      size += entry.size;
    }
    this.size = size;
  }
}

export const isEncapsulation = (block: Ledger.Parser.Block): block is Ledger.Parser.EncapsulationBlock =>
  block.type === 'InContext' ||
  block.type === 'UpdateContext' ||
  block.type === 'AuthorSignature' ||
  block.type === 'PreviousBlock';

const extractNotaryName = (completeFileName: string) =>
  completeFileName.split(exportNotaryProofsPrefix).pop()?.split(exportInchainSuffix)[0] || '';

@Injectable({ providedIn: 'root' })
export class StorageService {
  ledgersMap: LedgersMap = {};

  private get cachedData(): LedgerStorage {
    const ledgers = Object.values(this.ledgersMap);

    if (!ledgers.length) {
      // TODO: a custom error in `error.ts` should be provided here.
      throw new Error('No valid ledgers have been identified inside the archive');
    }

    return ledgers[0];
  }

  get archiveSize(): number {
    return this.cachedData.size;
  }

  constructor(
    private readonly dotnet: DotNetWrapperService,
    private readonly parser: LedgerBlockParseService,
  ) { }

  private async extractLedgerPublicKey(): Promise<Uint8Array> {
    if (this.cachedData.ledgerPublicKey$) {
      return this.cachedData.ledgerPublicKey$;
    }

    const policyBlockItem = await this.getBlock(0);
    const policyBlock = await policyBlockItem.getParsed();
    if (policyBlock.type !== 'Policy') {
      throw new MalformedLedgerError();
    }

    const policy = parsePolicyV1(policyBlock);
    return base64ToU8(policy.LedgerPublicKey); // TODO: validate json content
  }

  private getLedgerPublicKey(): Promise<Uint8Array> {
    return this.cachedData.ledgerPublicKey$ ??= this.extractLedgerPublicKey();
  }

  private async computeKey(data: Uint8Array, keyEntry?: ZipEntry) {
    const key = keyEntry && new Uint8Array(await keyEntry.arrayBuffer());

    if (this.cachedData.ledgerSecretKey$) {
      const secretKey = await this.cachedData.ledgerSecretKey$;
      const sharedKey = await this.dotnet.computeKey(data, secretKey);
      if (key && u8ToBase64(key) !== u8ToBase64(sharedKey)) {
        throw new InvalidLedgerKeysError();
      }
      return sharedKey;
    }

    if (!key) {
      throw new NoAvailableDecryptionKeyError();
    }

    return key;
  }

  private async decrypt(data: Uint8Array, keyEntry?: ZipEntry) {
    const key = await this.computeKey(data, keyEntry);
    return await this.dotnet.decrypt(data, key, await this.getLedgerPublicKey());
  }

  async load(data: Blob | string): Promise<void> {
    const zipInfo = await unzipRaw(createReader(data));
    this.ledgersMap = await parseLedgersMap(zipInfo.entries);
  }

  reset(): void {
    this.ledgersMap = {};
  }

  /**
   * Ledger methods
   */
  async getLedgerInfo(): Promise<LedgerInfo> {
    return this.cachedData.info;
  }

  async getCompleteBlocksCount(): Promise<number> {
    return (await this.getLedgerInfo()).headIndex + 1;
  }

  getBlocksCount(): number {
    return this.cachedData.blocks.size;
  }

  getNotaries(): Promise<Notary[]> {
    return this.cachedData.other.get('notaries.json')?.json() as Promise<Notary[]>;
  }

  getNotaryProofs(): Notarization[] {
    return [...this.cachedData.notaryProofs.entries()].map(([name, value]) => ({
      name,
      json$: value.json() as Promise<NotaryProof>,
    }));
  }

  getBlocks(offset: number, count: number): Promise<BlockItem[]> {
    return Promise.all(Array.from({ length: count }, (_, i) => this.getBlock(offset + i)));
  }

  getOffchainsCount(): number {
    return this.cachedData.offchain.size;
  }

  async getOffchain(hash: Uint8Array): Promise<OffchainItem | undefined> {
    const zipEntry = this.cachedData.offchain.get(u8ToHex(hash).toUpperCase());
    return zipEntry && this.makeOffchainItem(zipEntry);
  }

  async getOffchains(offset: number, count: number): Promise<OffchainItem[]> {
    return [...this.cachedData.offchain.values()]
      .slice(offset, offset + count)
      .map((zipEntry) => this.makeOffchainItem(zipEntry));
  }

  getInchainKeys(offset: number, count: number): Promise<InchainKeyItem[]> {
    return Promise.all([...this.cachedData.inchainKeys.entries()]
      .slice(offset, offset + count)
      .map(async ([index, zipEntry]) => ({
        index,
        key: new Uint8Array(await zipEntry.arrayBuffer()),
        hasValidReference: () => this.cachedData.blocks.has(index),
      })),
    );
  }

  getInchainKeysCount(): number {
    return this.cachedData.inchainKeys.size;
  }

  getOffchainKeys(offset: number, count: number): Promise<OffchainKeyItem[]> {
    return Promise.all([...this.cachedData.offchainKeys.entries()]
      .slice(offset, offset + count)
      .map(async ([hash, zipEntry]) => ({
        hash,
        key: new Uint8Array(await zipEntry.arrayBuffer()),
        hasValidReference: () => this.cachedData.offchain.has(hash),
      })),
    );
  }

  getOffchainKeysCount(): number {
    return this.cachedData.offchainKeys.size;
  }

  async getKeyPair(): Promise<KeyPair | undefined> {
    if (!this.cachedData.keyPair) {
      return;
    }

    const json: any = await this.cachedData.keyPair.json();

    // Note: the JSON format should be checked in someway
    return {
      createdAt: json.createdAt,
      curve: json.curve,
      keyId: json.keyId,
      keyType: json.keyType,
      publicKey: json.publicKey,
      secretKey: json.secretKey,
    };
  }

  async getExportRequest(): Promise<ExportRequest | undefined> {
    if (!this.cachedData.exportRequest) {
      return;
    }

    const json: any = await this.cachedData.exportRequest.json();

    // Note: the JSON format should be checked in someway
    return {
      collaboratorMode: json.collaboratorMode,
      defaultPage: json.defaultPage,
      deletedDocuments: json.deletedDocuments,
      deletedStreams: json.deletedStreams,
      documentMode: json.documentMode,
      documentVersion: json.documentVersion,
      exceptCollaborators: json.exceptCollaborators,
      exceptDocuments: json.exceptDocuments,
      exceptStreams: json.exceptStreams,
      exceptThreads: json.exceptThreads,
      isFullExport: json.isFullExport,
      keyMode: json.keyMode,
      streamMode: json.streamMode,
      streamReferences: json.streamReferences,
      streamVersion: json.streamVersion,
      name: json.name,
      threadMode: json.threadMode,
      threadReferences: json.threadReferences,
      workflowMode: json.workflowMode,
    };
  }

  async getRawBlock(index: number): Promise<Block | undefined> {
    const entry = this.cachedData.blocks.get(index);
    if (!entry) {
      return;
    }

    const json: any = await entry.json();
    const block: Block = json; // TODO: validate json content

    return block;
  }

  async decryptBlock(data: Uint8Array, index: number) {
    const keyEntry = this.cachedData.inchainKeys.get(index);
    return this.decrypt(data, keyEntry);
  }

  async getBlockIdentification(index: number): Promise<BlockIdentification> {
    const r: BlockIdentification = {
      index,
      linkHash: emptyU8,
    };

    try {
      const block = await this.getRawBlock(index);
      if (!block) {
        return r;
      }
      r.linkHash = base64ToU8(block.linkHash);

      const writeReceiptRaw = base64ToU8(block.writeReceipt);
      const writeReceiptData = writeReceiptRaw.slice(vaultKeyLength + vaultSignatureLength);

      const writeReceipt: WriteReceipt = JSON.parse(new TextDecoder().decode(writeReceiptData));
      r.createdAt = writeReceipt.WrittenAt;

      return r;
    } catch {
      return r;
    }
  }

  async getBlock(index: number): Promise<BlockItem> {
    const keyEntry = this.cachedData.inchainKeys.get(index);

    const r: BlockItem = {
      index,
      linkHash: emptyU8,
      size: NaN,
      encapsulations: [],
      blockType: undefined,
      merkleTreeRoot: emptyU8,
      hasKey: !!keyEntry,
      getRaw: () => { throw new LedgerBlockNotFoundError(index); },
      getParsed: () => { throw new MalformedLedgerBlockError(index); },
      getDecrypted: () => { throw new LedgerBlockDecryptionError(index); },
    };

    // blocks are assumed to be small, so they are kept alive with the BlockItem
    let raw: Uint8Array;
    try {
      const block = await this.getRawBlock(index);
      if (!block) {
        return r;
      }
      r.merkleTreeRoot = base64ToU8(block.merkleTreeRoot);
      r.linkHash = base64ToU8(block.linkHash);

      const writeReceiptRaw = base64ToU8(block.writeReceipt);
      // const writeReceiptKey = writeReceiptRaw.slice(0, vaultKeyLength);
      // const writeReceiptSignature = writeReceiptRaw.slice(vaultKeyLength, vaultKeyLength + vaultSignatureLength);
      const writeReceiptData = writeReceiptRaw.slice(vaultKeyLength + vaultSignatureLength);

      const writeReceipt: WriteReceipt = JSON.parse(new TextDecoder().decode(writeReceiptData));
      r.createdAt = writeReceipt.WrittenAt;

      raw = base64ToU8(block.payload);
      r.size = raw.byteLength;
      const raw$ = Promise.resolve(raw);
      r.getRaw = () => raw$;
    } catch {
      r.getRaw = () => { throw new LedgerBlockReadError(index); };
      return r;
    }

    let parsed: Ledger.Parser.Block;
    try {
      parsed = await this.parser.parse(raw);
      r.getParsed = async () => parsed;
    } catch {
      return r;
    }

    let currentBlock = parsed;
    while (isEncapsulation(currentBlock)) {
      r.encapsulations.push(currentBlock.type);
      currentBlock = currentBlock.inner;
    }
    r.blockType = currentBlock.type;
    if (currentBlock.type === 'Data') {
      const data = currentBlock.data;
      let decrypted$: Promise<Uint8Array>;
      r.getDecrypted = () => decrypted$ ??= this.decrypt(data, keyEntry);
    }

    return r;
  }

  private makeOffchainItem(zipEntry: ZipEntry): OffchainItem {
    const entryPrefixLength = this.cachedData.entryNamePrefix.length;
    const hexHash = zipEntry.name.substring(exportOffchainPrefix.length + entryPrefixLength);
    const keyEntry = this.cachedData.offchainKeys.get(hexHash);

    let tRaw$: Promise<Uint8Array>;
    let decrypted$: Promise<Uint8Array>;

    const getRaw = () => tRaw$ ??= zipEntry.arrayBuffer().then((data) => new Uint8Array(data));
    const getDecrypted = () => decrypted$ ??= getRaw().then((data) => this.decrypt(data, keyEntry));

    return {
      hash: hexToU8(hexHash),
      size: zipEntry.size,
      hasKey: !!keyEntry,
      getRaw,
      getDecrypted,
    };
  }
}
