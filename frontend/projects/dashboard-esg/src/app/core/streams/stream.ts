import { isRedacted, Redactable, RedactedMarker } from '@traent/ngx-components';
import { UIPaginationParams } from '@traent/ngx-paginator';

import { LedgerResource, RedactableBox } from '../ledger';
import { StreamEntryV0 } from '../ledger-objects/models';

export const STREAM_LABEL = 'StreamEntryV0';

export type StreamEntryType =
  | 'approval'
  | 'date'
  | 'number'
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
}> & UIPaginationParams;

export const parseStreamType = (type?: string): StreamEntryType | undefined => {
  switch (type) {
    case 'approval':
    case 'date':
    case 'number':
    case 'text':
    case 'currency':
    case 'boolean':
    case 'dropdown':
    case 'uri':
    case 'json':
    case undefined:
      return type;
    default:
      return 'custom';
  }
};

export const parseStream = (stream: any): StreamEntry => ({
  ...stream,
  uiType: stream.type && !isRedacted(stream.type)
    ? parseStreamType(stream.type)
    : RedactedMarker,
});
