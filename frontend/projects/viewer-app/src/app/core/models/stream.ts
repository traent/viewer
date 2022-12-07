import { StreamEntryV0, StreamReferenceV0 } from '@ledger-objects';
import { Redactable } from '@traent/ngx-components';
import { ResourceCollectionParams } from '@viewer/utils';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type StreamEntryType =
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
}> & ResourceCollectionParams<StreamEntry>;

export type StreamReference = RedactableBox<StreamReferenceV0> & LedgerResource;
export type StreamReferenceParams = Partial<{
  documentId: string;
  isLocallyReferenced: boolean;
  streamEntryId: string;
}> & ResourceCollectionParams<StreamReference>;
