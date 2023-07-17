import { ProfileValidationState } from '@api/models';

export interface Organization {
  logo?: string;
  businessName?: null | string;
  id: string;
  legalName?: null | string;
  validationState?: ProfileValidationState;
};
