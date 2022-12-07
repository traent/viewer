import {
  InvalidEntryNameError,
  KeyPair,
  LedgerInfo,
  ZipEntry,
} from '../models';
import { base64ToU8 } from './uint8';

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

const extractNotaryName = (completeFileName: string) =>
  completeFileName.split(exportNotaryProofsPrefix).pop()?.split(exportInchainSuffix)[0] || '';

/**
 * Abstraction that represents the basic storage that contains all the files relative to a specific
 * ledger.
 *
 * Note: No operations have been defined, this class just collects the data and organiza it.
 */
export class LedgerStorage {
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
