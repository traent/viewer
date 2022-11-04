/* tslint:disable */
/* eslint-disable */
import { ProfileFieldType } from './profile-field-type';
import { ProfileFieldValidation } from './profile-field-validation';
import { ResourceSyntheticLedger } from './resource-synthetic-ledger';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { UserProfileFieldName } from './user-profile-field-name';
export interface UserProfileField {
  creatorId: string;
  id: string;
  name: UserProfileFieldName;
  syntheticLedger: ResourceSyntheticLedger;
  syntheticLocal: ResourceSyntheticLocal;
  type: ProfileFieldType;
  updaterId: string;
  validation?: ProfileFieldValidation;
  value?: null | any;
}
