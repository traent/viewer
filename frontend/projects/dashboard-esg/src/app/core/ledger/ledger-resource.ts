import { RedactedMarker } from '@traent/ngx-components';

import { BlockIdentification } from './block-table';

export interface LedgerResource {
  id: string;
  createdInBlock: BlockIdentification;
  updatedInBlock: BlockIdentification;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Utility generics type that maps an object to its version with a `Redactable`
 * version each of its properties.
 *
 * Note: this implementation highlights the fact that the `id` property of the
 * ledger objects cannot be redacted by design.
 */
export type RedactableBox<T> = {
  [k in keyof T]: T[k] | (k extends 'id' ? never : typeof RedactedMarker);
};
