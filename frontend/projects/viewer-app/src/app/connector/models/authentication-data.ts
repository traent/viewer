/* tslint:disable */
/* eslint-disable */
import { AuthenticationDataType } from './authentication-data-type';
import { ResourceSyntheticLedger } from './resource-synthetic-ledger';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { VerificationCode } from './verification-code';
export interface AuthenticationData {
  creatorId: string;
  id: string;
  syntheticLedger: ResourceSyntheticLedger;
  syntheticLocal: ResourceSyntheticLocal;
  type: AuthenticationDataType;
  updaterId: string;
  value: string;
  verificationCode: VerificationCode;
}
