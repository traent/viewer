/* tslint:disable */
/* eslint-disable */
import { ProfileValidationState } from './profile-validation-state';
export interface ViewerMember {
  avatar?: null | any;
  firstName: string;
  id: string;
  jobTitle?: null | string;
  lastName: string;
  memberValidationState: ProfileValidationState;
  userValidationState: ProfileValidationState;
}
