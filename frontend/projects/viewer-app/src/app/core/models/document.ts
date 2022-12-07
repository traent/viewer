import { DocumentV0 } from '@ledger-objects';
import { Redactable } from '@traent/ngx-components';
import { ResourceCollectionParams } from '@viewer/utils';

import { LedgerResource, RedactableBox } from './ledger-resource';

export enum DocumentContentType {
  PDF = 'PDF',
  FORM = 'FORM',
  Image = 'Image',
  Video = 'Video',
  View = 'View',
  Generic = 'Generic',
}

export type Document = RedactableBox<DocumentV0> & {
  uiType: Redactable<DocumentContentType>;
  extension: string;
  isContentReadable: boolean;
} & LedgerResource;

export type DocumentParams = Partial<{
  uiType: DocumentContentType[];
}> & ResourceCollectionParams<Document>;
