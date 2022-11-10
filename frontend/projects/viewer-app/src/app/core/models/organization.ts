import { ProfileValidationState } from '@api/models';

export interface Organization {
  logo?: string;
  businessName?: string;
  id: string;
  legalName?: string;
  validationState?: ProfileValidationState;
};
