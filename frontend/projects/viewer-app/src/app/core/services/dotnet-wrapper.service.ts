import { Injectable } from '@angular/core';

class Validator {
  constructor(private readonly state: Ledger.Validator.StateHandle) { }

  evaluate(rawBlock?: DotNet.InputByteArray, rawReceipt?: DotNet.InputByteArray) {
    return this.state.invokeMethod('Evaluate', rawBlock, rawReceipt);
  }

  dispose() {
    this.state.dispose();
  }
}

class NotaryChecker {
  constructor(private readonly state: Ledger.Validator.NotaryChecker) { }

  getExpectedDigest() {
    return this.state.invokeMethod('GetExpectedDigest');
  }

  getMerkleRoot() {
    return this.state.invokeMethod('GetMerkleRoot');
  }

  checkConsistencyStep(path: DotNet.InputByteArray[], merkleConsistencyProof: DotNet.InputByteArray) {
    return this.state.invokeMethod('CheckConsistencyStep', path, merkleConsistencyProof);
  }

  finishConsistencyCheck() {
    return this.state.invokeMethod('FinishConsistencyCheck');
  }

  dispose() {
    return this.state.dispose();
  }
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
    return new Validator(DotNet.invokeMethod('Ledger.Wasm.Container', 'CreateValidator', ledgerId));
  }

  async makeNotaryChecker(ledgerId: DotNet.InputByteArray): Promise<NotaryChecker> {
    await this.ready$;
    return new NotaryChecker(DotNet.invokeMethod('Ledger.Wasm.Container', 'CreateNotaryChecker', ledgerId));
  }
}
