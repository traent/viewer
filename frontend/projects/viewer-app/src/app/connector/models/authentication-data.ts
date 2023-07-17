/* tslint:disable */
/* eslint-disable */
import { AuthenticationDataType } from './authentication-data-type';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { VerificationCode } from './verification-code';
export interface AuthenticationData {
  creatorId: string;
  id: string;
  syntheticLocal: ResourceSyntheticLocal;
  type: AuthenticationDataType;
  updaterId: string;
  value: string;
  verificationCode: VerificationCode;
}
