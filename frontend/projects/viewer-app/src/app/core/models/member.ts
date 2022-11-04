import { ProfileValidationState } from '@api/models';

export interface Member {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  shortName?: string;
  avatar?: string;
  mock?: boolean;
  memberValidationState?: ProfileValidationState;
  userValidationState?: ProfileValidationState;
  jobTitle?: string;
}
