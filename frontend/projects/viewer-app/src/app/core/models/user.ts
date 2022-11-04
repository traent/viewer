import { ProfileValidation } from '@api/models';

export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  avatar?: string;
  validation?: ProfileValidation;
}
