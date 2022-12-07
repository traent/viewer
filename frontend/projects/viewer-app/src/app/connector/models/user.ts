/* tslint:disable */
/* eslint-disable */
import { AuthenticationData } from './authentication-data';
import { EnableState } from './enable-state';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { UserProfile } from './user-profile';
export interface User {
  creatorId: string;
  enable: EnableState;
  id: string;
  profile: UserProfile;
  syntheticLocal: ResourceSyntheticLocal;
  twoFactorAuthenticationData?: AuthenticationData;
  updaterId: string;
}
