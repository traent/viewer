/* tslint:disable */
/* eslint-disable */
import { ProfileFieldValidationState } from './profile-field-validation-state';
export interface ProfileFieldValidation {
  message?: null | string;
  state: ProfileFieldValidationState;
  updatedAt: string;
  updatedById: string;
}
