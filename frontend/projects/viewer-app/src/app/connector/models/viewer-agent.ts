/* tslint:disable */
/* eslint-disable */
import { ProfileValidationState } from './profile-validation-state';
import { ViewerAgentType } from './viewer-agent-type';
export interface ViewerAgent {
  agentType: ViewerAgentType;
  agentValidationState: ProfileValidationState;
  avatar?: null | any;
  firstName?: null | string;
  id: string;
  jobTitle?: null | string;
  lastName?: null | string;
  name?: null | string;
  organizationId: string;
  type?: null | string;
  userValidationState?: ProfileValidationState;
}
