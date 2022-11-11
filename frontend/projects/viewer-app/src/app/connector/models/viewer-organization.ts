/* tslint:disable */
/* eslint-disable */
import { ProfileValidationState } from './profile-validation-state';
export interface ViewerOrganization {
  businessName: string;
  id: string;
  legalName: string;
  logo?: null | any;
  validationState: ProfileValidationState;
}
