/* tslint:disable */
/* eslint-disable */
import { ProfileValidationState } from './profile-validation-state';
export interface ProfileValidation {
  message?: null | string;
  state: ProfileValidationState;
  updatedAt?: string;
  updatedById?: null | string;
}
