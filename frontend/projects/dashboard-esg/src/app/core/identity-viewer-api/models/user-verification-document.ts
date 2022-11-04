/* tslint:disable */
/* eslint-disable */
import { ResourceSyntheticLedger } from './resource-synthetic-ledger';
import { ResourceSyntheticLocal } from './resource-synthetic-local';
import { VerificationDocumentValidation } from './verification-document-validation';
export interface UserVerificationDocument {
  contentType: string;
  creatorId: string;
  fileName: string;
  id: string;
  syntheticLedger: ResourceSyntheticLedger;
  syntheticLocal: ResourceSyntheticLocal;
  type: string;
  updaterId: string;
  userId: string;
  validation?: VerificationDocumentValidation;
}
