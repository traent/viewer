import { Injectable } from '@angular/core';
import { isExported, isRedacted, RedactedMarker } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { StreamEntry, StreamEntryType, StreamParams, StreamReference, StreamReferenceParams } from '../models';
import { collectionSort, collectionToPage, ResourceParams, transformerFrom } from '../utils';

const parseStreamType = (type?: string): StreamEntryType | undefined => {
  switch (type) {
    case 'date':
    case 'number':
    case 'multi-select':
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

export const STREAM_LABEL = 'StreamEntryV0';
export const STREAM_REFERENCE_LABEL = 'StreamReferenceV0';

export const parseStream = (stream: any): StreamEntry => ({
  ...stream,
  uiType: stream.type && !isRedacted(stream.type)
    ? parseStreamType(stream.type)
    : RedactedMarker,
});

const extractStreamEntriesFromState = (state: LedgerState): StreamEntry[] =>
  transformerFrom(parseStream)(state[STREAM_LABEL]);

const parseStreamReference = (obj: any): StreamReference => obj as StreamReference;

const extractStreamReferencesFromState = (state: LedgerState): StreamReference[] =>
  transformerFrom(parseStreamReference)(state[STREAM_REFERENCE_LABEL]);

@Injectable({ providedIn: 'root' })
export class StreamService {
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getStream({ id, blockIndex, ledgerId }: ResourceParams): Promise<StreamEntry> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(STREAM_LABEL, id, blockIndex);
    return parseStream(object);
  }

  async getStreamCollection(params?: StreamParams): Promise<Page<StreamEntry>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractStreamEntriesFromState(currentState);

    if (params?.uiType) {
      collection = collection.filter((entry) => isExported(entry.uiType) && entry.uiType === params.uiType);
    }

    if (params?.documentId) {
      const streamReferences = extractStreamReferencesFromState(currentState);
      const streamIds = streamReferences
        .filter((streamReference) => streamReference?.documentId === params.documentId)
        .map((streamReference) => streamReference.streamEntryId);
      collection = collection.filter((thread) => streamIds.includes(thread.id));
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'name', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  async getStreamReference({ id, blockIndex, ledgerId }: ResourceParams): Promise<StreamReference> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(STREAM_REFERENCE_LABEL, id, blockIndex);
    return parseStreamReference(object);
  }

  async getStreamReferencesCollection(params?: StreamReferenceParams): Promise<Page<StreamReference>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractStreamReferencesFromState(currentState);

    if (params?.isLocallyReferenced !== undefined) {
      const isLocallyReferenced = params.isLocallyReferenced;
      collection = collection.filter((reference) => isLocallyReferenced ? !!reference.anchor : !reference.anchor);
    }

    if (params?.documentId) {
      collection = collection.filter((reference) =>
        isExported(reference.documentId) && reference.documentId === params.documentId,
      );
    }

    if (params?.streamEntryId) {
      collection = collection.filter((reference) =>
        isExported(reference.streamEntryId) && reference.streamEntryId === params.streamEntryId,
      );
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'id', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }
}
