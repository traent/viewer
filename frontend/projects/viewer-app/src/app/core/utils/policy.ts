import { LedgerPolicyV1 } from '../models/block-table';
import { MalformedLedgerError } from '../models/error';

export const parsePolicyV1 = (block: Ledger.Parser.PolicyBlock): LedgerPolicyV1 => {
  if (block.version !== 1) {
    throw new MalformedLedgerError();
  }
  const policyJson = new TextDecoder().decode(block.policy);
  const policy = JSON.parse(policyJson);

  return policy;
};
