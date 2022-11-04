/* tslint:disable */
/* eslint-disable */
import { Acknowledgement } from './acknowledgement';
export interface LedgerBlock {
  acknowledgements: Array<Acknowledgement>;
  authorKeyId?: null | string;
  hash: string;
  index: number;
  writtenAt: string;
}
