/* tslint:disable */
/* eslint-disable */
import { AuthenticationData } from './authentication-data';
import { EnableState } from './enable-state';
import { ResourceSyntheticLedger } from './resource-synthetic-ledger';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { UserProfile } from './user-profile';
export interface User {
  creatorId: string;
  enable: EnableState;
  id: string;
  profile: UserProfile;
  syntheticLedger: ResourceSyntheticLedger;
  syntheticLocal: ResourceSyntheticLocal;
  twoFactorAuthenticationData?: AuthenticationData;
  updaterId: string;
}
