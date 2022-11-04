import { DocumentV0 } from '@ledger-objects';
import { SortableResource } from '@viewer/utils';
import { Redactable } from '@traent/ngx-components';
import { UIPaginationParams } from '@traent/ngx-paginator';

import { LedgerResource, RedactableBox } from './ledger-resource';

export enum DocumentContentType {
  PDF = 'PDF',
  FORM = 'FORM',
  Image = 'Image',
  Video = 'Video',
  Generic = 'Generic',
}

export type Document = RedactableBox<DocumentV0> & {
  uiType: Redactable<DocumentContentType>;
  extension: string;
  isContentReadable: boolean;
} & {
  getData: () => Promise<Uint8Array | undefined>;
} & LedgerResource;

export type DocumentParams = Partial<{
  uiType: DocumentContentType[];
}> & UIPaginationParams & SortableResource<Document>;
