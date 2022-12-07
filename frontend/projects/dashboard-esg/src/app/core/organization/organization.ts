import { ProfileValidationState } from '../identity-viewer-api/models';

export interface Organization {
  address?: null | any;
  businessName: string;
  id: string;
  legalName: string;
  logo?: null | any;
  validationState: ProfileValidationState;
  website?: null | string;
};
