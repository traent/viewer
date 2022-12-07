declare namespace Blazor {
  function start(options?: WebAssemblyStartOptions): Promise<void>;

  interface WebAssemblyStartOptions {
    /**
     * Overrides the built-in boot resource loading mechanism so that boot resources can be fetched
     * from a custom source, such as an external CDN.
     *
     * @param type The type of the resource to be loaded.
     * @param name The name of the resource to be loaded.
     * @param defaultUri The URI from which the framework would fetch the resource by default. The URI may be relative or absolute.
     * @param integrity The integrity string representing the expected content in the response.
     * @returns A URI string or a Response promise to override the loading process, or null/undefined to allow the default loading behavior.
     */
    loadBootResource(type: string, name: string, defaultUri: string, integrity: string): string | Promise<Response> | null | undefined;

    /**
     * Override built-in environment setting on start.
     */
    environment?: string;

    /**
     * Gets the application culture. This is a name specified in the BCP 47 format. See https://tools.ietf.org/html/bcp47
     */
    applicationCulture?: string;
  }
}

declare namespace DotNet {
  type InputByteArray = string | Uint8Array;

  function invokeMethod(namespace: 'Ledger.Wasm.Container', method: 'ComputeSharedKeyFromBox',
    box: InputByteArray,
    secretSignatureKey: InputByteArray,
  ): Uint8Array;

  function invokeMethod(namespace: 'Ledger.Wasm.Container', method: 'Decrypt',
    box: InputByteArray,
    sharedKey: InputByteArray,
    publicSignatureKey: InputByteArray,
    paddingBlockSize: number,
  ): Uint8Array;

  function invokeMethod(namespace: 'Ledger.Wasm.Container', method: 'Hash',
    ledgerId: InputByteArray,
    algorithm: string,
    message: InputByteArray,
  ): Uint8Array;

  function invokeMethod(namespace: 'Ledger.Wasm.Container', method: 'Parse', data: InputByteArray): Ledger.Parser.Block;

  function invokeMethod(namespace: 'Ledger.Wasm.Container', method: 'CreateValidator',
    ledgerId: InputByteArray,
  ): Ledger.Validator.StateHandle;

  function invokeMethod(namespace: 'Ledger.Wasm.Container', method: 'CreateNotaryChecker',
    ledgerId: InputByteArray,
  ): Ledger.Validator.NotaryChecker;
}

declare namespace Ledger.Validator {
  export interface NotaryChecker {
    invokeMethod(method: 'GetExpectedDigest' | 'GetMerkleRoot'): Uint8Array | undefined;
    invokeMethod(method: 'CheckConsistencyStep',
      path: DotNet.InputByteArray[],
      merkleConsistencyProof: DotNet.InputByteArray,
    ): string[];
    invokeMethod(method: 'FinishConsistencyCheck'): string[];

    dispose(): void;
  }

  export interface StateHandle {
    invokeMethod(method: 'Evaluate',
      rawBlock?: DotNet.InputByteArray,
      rawReceipt?: DotNet.InputByteArray,
    ): Ledger.Validator.EvaluationResult;
    dispose(): void;
  }

  export type ValidationError =
    // ref: https://github.com/traent-labs/traent/blob/master/ledger-dotnet/Ledger.Receipt/ValidationProblem.cs
    | 'ValidationProblem.AfterMaxTime'
    | 'ValidationProblem.BeforeMinTime'
    | 'ValidationProblem.HashMismatch'
    | 'ValidationProblem.InvalidSignature'
    | 'ValidationProblem.LedgerIdMismatch'
    | 'ValidationProblem.MalformedPayload'
    | 'ValidationProblem.MalformedReceipt'
    | 'ValidationProblem.MerkleRootMismatch'
    // ref: https://github.com/traent-labs/traent/blob/master/ledger-dotnet/Ledger.Evaluator/EvaluationProblem.cs
    | 'EvaluationProblem.AuthorAlreadyPresent'
    | 'EvaluationProblem.AuthorNotFound'
    | 'EvaluationProblem.BlockLinkHashMismatch'
    | 'EvaluationProblem.BlockNotFound'
    | 'EvaluationProblem.BlockTooBig'
    | 'EvaluationProblem.BlockTypeNotAllowed'
    | 'EvaluationProblem.CannotParsePolicy'
    | 'EvaluationProblem.ContextLinkHashMismatch'
    | 'EvaluationProblem.InvalidAuthorKey'
    | 'EvaluationProblem.InvalidSignature'
    | 'EvaluationProblem.InvalidHashLength'
    | 'EvaluationProblem.InvalidPolicyVersion'
    | 'EvaluationProblem.MalformedBlock'
    | 'EvaluationProblem.PreviousBlockHashMismatch';

  export type EvaluationResult = {
    writeReceiptSignatureKey?: Uint8Array;
    writeReceipt?: WriteReceipt;
    problems: ValidationError[];
  } & ({
    block: Ledger.Parser.Block;
    linkHash: Uint8Array;
    merkleRootHash: Uint8Array;
  } | {
    block: undefined;
    linkHash: undefined;
    merkleRootHash: undefined;
  });

  interface WriteReceipt {
    ledger: Uint8Array;
    hash: Uint8Array;
    merkleRoot: Uint8Array;
    writtenAt: string;
  }
}

declare namespace Ledger.Parser {
  type EncapsulationBlockType = EncapsulationBlock['type'];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type TerminalBlockType = TerminalBlock['type'];

  type Block = TerminalBlock | EncapsulationBlock;

  type TerminalBlock =
    | AckBlock
    | AddAuthorsBlock
    | DataBlock
    | PolicyBlock
    | ReferenceBlock;

  type EncapsulationBlock =
    | InContextEncapsulation
    | PreviousBlockEncapsulation
    | SignatureEncapsulation
    | UpdateContextEncapsulation;

  interface EncapsulationInterface {
    inner: Block;
    type: EncapsulationBlockType;
  }

  interface AckBlock {
    targetIndex: number;
    targetLinkHash: Uint8Array;
    type: 'Ack';
  }

  interface AddAuthorsBlock {
    authorKeys: Uint8Array[];
    type: 'AddAuthors';
  }

  interface DataBlock {
    data: Uint8Array;
    type: 'Data';
  }

  export interface PolicyBlock {
    version: number;
    policy: Uint8Array;
    type: 'Policy';
  }

  interface ReferenceBlock {
    hashes: Uint8Array[];
    type: 'Reference';
  }

  interface InContextEncapsulation extends EncapsulationInterface {
    contextLinkHash: Uint8Array;
    type: 'InContext';
  }

  interface PreviousBlockEncapsulation extends EncapsulationInterface {
    previousBlockHash: Uint8Array;
    type: 'PreviousBlock';
  }

  interface SignatureEncapsulation extends EncapsulationInterface {
    authorId: Uint8Array;
    authorSignature: Uint8Array;
    type: 'AuthorSignature';
  }

  interface UpdateContextEncapsulation extends EncapsulationInterface {
    type: 'UpdateContext';
  }
}
