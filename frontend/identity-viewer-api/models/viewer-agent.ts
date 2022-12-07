/* tslint:disable */
/* eslint-disable */
import { ProfileValidationState } from './profile-validation-state';
export interface ViewerAgent {
  agentValidationState: ProfileValidationState;
  avatar?: null | any;
  firstName?: null | string;
  id: string;
  jobTitle?: null | string;
  lastName?: null | string;
  name?: null | string;
  organizationId: string;
  userValidationState?: ProfileValidationState;
}
