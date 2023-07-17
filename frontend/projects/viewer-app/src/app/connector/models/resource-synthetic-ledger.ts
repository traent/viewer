/* tslint:disable */
/* eslint-disable */
import { LedgerBlock } from './ledger-block';
export interface ResourceSyntheticLedger {
  createdAt: string;
  createdInBlock: LedgerBlock;
  ledgerHandleAddress: string;
  updatedAt: string;
  updatedInBlock: LedgerBlock;
}
