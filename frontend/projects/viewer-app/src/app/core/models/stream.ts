import { StreamEntryV0, StreamReferenceV0 } from '@ledger-objects';
import { SortableResource } from '@viewer/utils';
import { Redactable } from '@traent/ngx-components';
import { UIPaginationParams } from '@traent/ngx-paginator';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type StreamEntryType =
  | 'approval'
  | 'date'
  | 'number'
  | 'multi-select'
  | 'text'
  | 'currency'
  | 'boolean'
  | 'dropdown'
  | 'uri'
  | 'json'
  | 'custom';

export type StreamEntry = RedactableBox<StreamEntryV0> & {
  /**
   * Casted type of stream entry
   */
  uiType: Redactable<StreamEntryType>;
} & LedgerResource;
export type StreamParams = Partial<{
  uiType: StreamEntryType;
  documentId: string;
}> & SortableResource<StreamEntry> & UIPaginationParams;

export type StreamReference = RedactableBox<StreamReferenceV0> & {
  streamEntry: () => Promise<StreamEntry | undefined>;
} & LedgerResource;
export type StreamReferenceParams = Partial<{
  documentId: string;
  isLocallyReferenced: boolean;
  streamEntryId: string;
}> & SortableResource<StreamReference> & UIPaginationParams;
