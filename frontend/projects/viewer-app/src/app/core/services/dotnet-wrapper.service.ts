import { Injectable } from '@angular/core';

interface Validator {
  evaluate(rawBlock?: DotNet.InputByteArray, rawReceipt?: DotNet.InputByteArray): Ledger.Validator.EvaluationResult;
  dispose(): void;
}

interface NotaryChecker {
  getExpectedDigest(): Uint8Array | undefined;
  getMerkleRoot(): Uint8Array | undefined;
  checkConsistencyStep(path: DotNet.InputByteArray[], merkleConsistencyProof: DotNet.InputByteArray): string[];
  finishConsistencyCheck(): string[];

  dispose(): void;
}

@Injectable({ providedIn: 'root' })
export class DotNetWrapperService {
  readonly ready$ = Blazor.start({
    loadBootResource: (type, name, _defaultUri, integrity) => {
      console.log(`Loading ${type} ${name}${integrity ? ` [integrity check: ${integrity}]` : ''}`);
      switch (type) {
        case 'manifest':
        case 'dotnetjs':
        case 'dotnetwasm':
        case 'timezonedata':
        default:
          return `/assets/wasm-parser/${name}`;
      }
    },
  });

  async computeKey(
    data: DotNet.InputByteArray,
    secretLedgerKey: DotNet.InputByteArray,
  ): Promise<Uint8Array> {
    await this.ready$;
    return DotNet.invokeMethod('Ledger.Wasm.Container', 'ComputeSharedKeyFromBox', data, secretLedgerKey);
  }

  async decrypt(
    data: DotNet.InputByteArray,
    sharedKey: DotNet.InputByteArray,
    publicLedgerKey: DotNet.InputByteArray,
    padding = 128,
  ): Promise<Uint8Array> {
    await this.ready$;
    return DotNet.invokeMethod('Ledger.Wasm.Container', 'Decrypt', data, sharedKey, publicLedgerKey, padding);
  }

  async computeHash(
    ledgerId: DotNet.InputByteArray,
    algorithm: string,
    message: DotNet.InputByteArray,
  ): Promise<Uint8Array> {
    await this.ready$;
    return DotNet.invokeMethod('Ledger.Wasm.Container', 'Hash', ledgerId, algorithm, message);
  }

  async parse(data: DotNet.InputByteArray): Promise<Ledger.Parser.Block> {
    await this.ready$;
    return DotNet.invokeMethod('Ledger.Wasm.Container', 'Parse', data);
  }

  async makeValidator(ledgerId: DotNet.InputByteArray): Promise<Validator> {
    await this.ready$;
    const state = DotNet.invokeMethod('Ledger.Wasm.Container', 'CreateValidator', ledgerId);

    const evaluate = (rawBlock?: DotNet.InputByteArray, rawReceipt?: DotNet.InputByteArray) =>
      state.invokeMethod('Evaluate', rawBlock, rawReceipt);

    const dispose = () => state.dispose();

    return { evaluate, dispose };
  }

  async makeNotaryChecker(ledgerId: DotNet.InputByteArray): Promise<NotaryChecker> {
    await this.ready$;
    const state = DotNet.invokeMethod('Ledger.Wasm.Container', 'CreateNotaryChecker', ledgerId);

    return {
      getExpectedDigest: () => state.invokeMethod('GetExpectedDigest'),
      getMerkleRoot: () => state.invokeMethod('GetMerkleRoot'),
      checkConsistencyStep: (path, merkleConsistencyProof) =>
        state.invokeMethod('CheckConsistencyStep', path, merkleConsistencyProof),
      finishConsistencyCheck: () => state.invokeMethod('FinishConsistencyCheck'),
      dispose: () => state.dispose(),
    };
  }

  async compuleLedgerId(publicLedgerKey: DotNet.InputByteArray): Promise<Uint8Array> {
    await this.ready$;
    return DotNet.invokeMethod('Ledger.Wasm.Container', 'ComputeLedgerId', publicLedgerKey);
  }
}
