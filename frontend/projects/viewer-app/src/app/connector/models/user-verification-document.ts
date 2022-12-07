/* tslint:disable */
/* eslint-disable */
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { VerificationDocumentValidation } from './verification-document-validation';
export interface UserVerificationDocument {
  contentType: string;
  creatorId: string;
  fileName: string;
  id: string;
  syntheticLocal: ResourceSyntheticLocal;
  type: string;
  updaterId: string;
  userId: string;
  validation?: VerificationDocumentValidation;
}
