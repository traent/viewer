const validationMessagesMap: Record<Ledger.Validator.ValidationError, (info: string | number) => string> = {
  'ValidationProblem.AfterMaxTime': (info: string | number) => `Write receipt for block #${info} is after the max time`,
  'ValidationProblem.BeforeMinTime': (info: string | number) => `Write receipt for block #${info} is before the min time`,
  'ValidationProblem.HashMismatch': (info: string | number) => `Write receipt for block #${info} has a hash mismatch`,
  'ValidationProblem.InvalidSignature': (info: string | number) => `Write receipt for block #${info} has an invalid signature`,
  'ValidationProblem.LedgerIdMismatch': (info: string | number) => `Write receipt for block #${info} has a ledger id mismatch`,
  'ValidationProblem.MalformedPayload': (info: string | number) => `Write receipt for block #${info} has a malformed payload`,
  'ValidationProblem.MalformedReceipt': (info: string | number) => `Write receipt for block #${info} is malformed`,
  'ValidationProblem.MerkleRootMismatch': (info: string | number) => `Write receipt for block #${info} has a merkle root mismatch`,
  'EvaluationProblem.AuthorAlreadyPresent': (info: string | number) => `Author added in block #${info} is already present`,
  'EvaluationProblem.AuthorNotFound': (info: string | number) => `Signature from an unexpected author in block #${info}`,
  'EvaluationProblem.BlockLinkHashMismatch': (info: string | number) => `Block #${info}'s previous link hash is not valid`,
  'EvaluationProblem.BlockNotFound': (info: string | number) => `Block #${info} not found`,
  'EvaluationProblem.BlockTooBig': (info: string | number) => `Block #${info} is too big`,
  'EvaluationProblem.BlockTypeNotAllowed': (info: string | number) => `Block #${info}'s encapsulation type is not allowed`,
  'EvaluationProblem.CannotParsePolicy': (info: string | number) => `Cannot parse policy in block #${info}`,
  'EvaluationProblem.ContextLinkHashMismatch': (info: string | number) => `Block #${info}'s context link hash is not valid`,
  'EvaluationProblem.InvalidAuthorKey': (info: string | number) => `Cryptographic author key invalid format evaluating block #${info}`,
  'EvaluationProblem.InvalidHashLength': (info: string | number) => `Block #${info}'s hash is not valid`,
  'EvaluationProblem.InvalidPolicyVersion': (info: string | number) => `Block #${info}'s policy version is not valid`,
  'EvaluationProblem.InvalidSignature': (info: string | number) => `Block #${info} has an invalid signature`,
  'EvaluationProblem.MalformedBlock': (info: string | number) => `Block #${info} is malformed`,
  'EvaluationProblem.PreviousBlockHashMismatch': (info: string | number) => `Block #${info}'s previous block hash is not valid`,
};

export const formatValidationError = (problem: Ledger.Validator.ValidationError, info: string | number) =>
  validationMessagesMap[problem](info);
