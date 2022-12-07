/* tslint:disable */
/* eslint-disable */
import { ProfileValidationState } from './profile-validation-state';
export interface ViewerOrganization {
  address?: null | any;
  businessName?: null | string;
  foundingLocation?: null | string;
  id: string;
  legalName?: null | string;
  logo?: null | any;
  validationState: ProfileValidationState;
  website?: null | string;
}
