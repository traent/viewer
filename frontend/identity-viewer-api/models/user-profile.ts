/* tslint:disable */
/* eslint-disable */
import { ProfileValidation } from './profile-validation';
import { ResourceSyntheticLedger } from './resource-synthetic-ledger';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { UserProfileField } from './user-profile-field';
export interface UserProfile {
  creatorId: string;
  fields: Array<UserProfileField>;
  id: string;
  syntheticLedger: ResourceSyntheticLedger;
  syntheticLocal: ResourceSyntheticLocal;
  updaterId: string;
  validation: ProfileValidation;
}
