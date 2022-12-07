import { last } from '@traent/ts-utils';

import { LedgerStorage } from './ledger-storage';
import { parsePolicyV1 } from './policy';
import { base64ToU8, emptyU8, hexToU8, u8ToBase64, u8ToHex } from './uint8';
import {
  BlockIdentification,
  BlockItem,
  ExportRequest,
  InchainKeyItem,
  InvalidLedgerKeysError,
  KeyPair,
  LedgerBlockDecryptionError,
  LedgerBlockNotFoundError,
  LedgerBlockReadError,
  LedgerInfo,
  MalformedLedgerBlockError,
  MalformedLedgerError,
  NoAvailableDecryptionKeyError,
  Notarization,
  Notary,
  NotaryProof,
  OffchainItem,
  OffchainKeyItem,
  ZipEntry,
} from '../models';

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

export const isEncapsulation = (block: Ledger.Parser.Block): block is Ledger.Parser.EncapsulationBlock =>
  block.type === 'InContext' ||
  block.type === 'UpdateContext' ||
  block.type === 'AuthorSignature' ||
  block.type === 'PreviousBlock';

interface CryptoProvider {
  computeKey(data: Uint8Array, secretLedgerKey: Uint8Array): Promise<Uint8Array>;
  decrypt(data: Uint8Array, sharedKey: Uint8Array, publicLedgerKey: Uint8Array): Promise<Uint8Array>;
}

interface BlockParser {
  parse(data: Uint8Array): Promise<Ledger.Parser.Block>;
}

interface LedgerProps {
  id: string;
  cryptoProvider: CryptoProvider;
  blockParser: BlockParser;
  ledgerStorage: LedgerStorage;
}

const vaultKeyLength = 32;
const vaultSignatureLength = 64;

export const parseUid = (uid: string): { ledgerId: string; resourceId: string } => {
  /**
   * Note: `uid` is in the format of `<ledgerId>.<resourceId>`
   */
  const [ledgerId, resourceId] = uid.split('.');

  if (!ledgerId || !resourceId) {
    throw new Error(`Unexpected uid ${uid}`);
  }

  return { ledgerId, resourceId };
};

/**
 * Class that processes the information contained inside a specific `LedgerStorage`
 * in order to expose them to the outside.
 */
export class Ledger {
  readonly id: string;
  private readonly cryptoProvider: CryptoProvider;
  private readonly blockParser: BlockParser;
  private readonly ledgerStorage: LedgerStorage;

  constructor({ id, cryptoProvider, blockParser, ledgerStorage }: LedgerProps) {
    this.id = id;
    this.cryptoProvider = cryptoProvider;
    this.blockParser = blockParser;
    this.ledgerStorage = ledgerStorage;
  }

  get archiveSize(): number {
    return this.ledgerStorage.size;
  }

  async getLedgerInfo(): Promise<LedgerInfo> {
    return this.ledgerStorage.info;
  }

  async getCompleteBlocksCount(): Promise<number> {
    return (await this.getLedgerInfo()).headIndex + 1;
  }

  getBlocksCount(): number {
    return this.ledgerStorage.blocks.size;
  }

  getNotaries(): Promise<Notary[]> {
    return this.ledgerStorage.other.get('notaries.json')?.json() as Promise<Notary[]>;
  }

  getNotaryProofs(): Notarization[] {
    return [...this.ledgerStorage.notaryProofs.entries()].map(([name, value]) => ({
      name,
      json$: value.json() as Promise<NotaryProof>,
    }));
  }

  getBlocks(offset: number, count: number): Promise<BlockItem[]> {
    return Promise.all(Array.from({ length: count }, (_, i) => this.getBlock(offset + i)));
  }

  getOffchainsCount(): number {
    return this.ledgerStorage.offchain.size;
  }

  async getOffchain(hash: Uint8Array): Promise<OffchainItem | undefined> {
    const zipEntry = this.ledgerStorage.offchain.get(u8ToHex(hash).toUpperCase());
    return zipEntry && this.makeOffchainItem(zipEntry);
  }

  async getOffchains(offset: number, count: number): Promise<OffchainItem[]> {
    return [...this.ledgerStorage.offchain.values()]
      .slice(offset, offset + count)
      .map((zipEntry) => this.makeOffchainItem(zipEntry));
  }

  getInchainKeys(offset: number, count: number): Promise<InchainKeyItem[]> {
    return Promise.all([...this.ledgerStorage.inchainKeys.entries()]
      .slice(offset, offset + count)
      .map(async ([index, zipEntry]) => ({
        index,
        key: new Uint8Array(await zipEntry.arrayBuffer()),
        hasValidReference: () => this.ledgerStorage.blocks.has(index),
      })),
    );
  }

  getInchainKeysCount(): number {
    return this.ledgerStorage.inchainKeys.size;
  }

  getOffchainKeys(offset: number, count: number): Promise<OffchainKeyItem[]> {
    return Promise.all([...this.ledgerStorage.offchainKeys.entries()]
      .slice(offset, offset + count)
      .map(async ([hash, zipEntry]) => ({
        hash,
        key: new Uint8Array(await zipEntry.arrayBuffer()),
        hasValidReference: () => this.ledgerStorage.offchain.has(hash),
      })),
    );
  }

  getOffchainKeysCount(): number {
    return this.ledgerStorage.offchainKeys.size;
  }

  async getKeyPair(): Promise<KeyPair | undefined> {
    if (!this.ledgerStorage.keyPair) {
      return;
    }

    const json: any = await this.ledgerStorage.keyPair.json();

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
    if (!this.ledgerStorage.exportRequest) {
      return;
    }

    const json: any = await this.ledgerStorage.exportRequest.json();

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
    const entry = this.ledgerStorage.blocks.get(index);
    if (!entry) {
      return;
    }

    const json: any = await entry.json();
    const block: Block = json; // TODO: validate json content

    return block;
  }

  async decryptBlock(data: Uint8Array, index: number) {
    const keyEntry = this.ledgerStorage.inchainKeys.get(index);
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
    const keyEntry = this.ledgerStorage.inchainKeys.get(index);

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
      parsed = await this.blockParser.parse(raw);
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

  private async extractLedgerPublicKey(): Promise<Uint8Array> {
    if (this.ledgerStorage.ledgerPublicKey$) {
      return this.ledgerStorage.ledgerPublicKey$;
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
    return this.ledgerStorage.ledgerPublicKey$ ??= this.extractLedgerPublicKey();
  }

  private async computeKey(data: Uint8Array, keyEntry?: ZipEntry) {
    const key = keyEntry && new Uint8Array(await keyEntry.arrayBuffer());

    if (this.ledgerStorage.ledgerSecretKey$) {
      const secretKey = await this.ledgerStorage.ledgerSecretKey$;
      const sharedKey = await this.cryptoProvider.computeKey(data, secretKey);
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
    return await this.cryptoProvider.decrypt(data, key, await this.getLedgerPublicKey());
  }

  private makeOffchainItem(zipEntry: ZipEntry): OffchainItem {
    const hexHash = last(zipEntry.name.split('/'));
    if (!hexHash) {
      throw new Error(`Invalid filename ${zipEntry.name}`);
    }
    const keyEntry = this.ledgerStorage.offchainKeys.get(hexHash);

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
