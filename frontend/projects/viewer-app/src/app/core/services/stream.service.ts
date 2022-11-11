import { Injectable } from '@angular/core';
import { Page } from '@traent/ngx-paginator';
import { isExported, isRedacted, RedactedMarker } from '@traent/ngx-components';

import { LedgerObjectsService, LedgerState } from './ledger-objects.service';
import { StreamEntry, StreamEntryType, StreamParams, StreamReference, StreamReferenceParams } from '../models';
import { collectionSort, collectionToPage, transformerFrom } from '../utils';

export const parseStream = (stream: any): StreamEntry => ({
  ...stream,
  uiType: stream.type && !isRedacted(stream.type)
    ? parseStreamType(stream.type)
    : RedactedMarker,
});

const parseStreamType = (type?: string): StreamEntryType | undefined => {
  switch (type) {
    case 'approval':
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

const extractStreamEntriesFromState = (state: LedgerState): StreamEntry[] =>
  transformerFrom(parseStream)(state[STREAM_LABEL]);

@Injectable({ providedIn: 'root' })
export class StreamService {
  constructor(private readonly ledgerObjectService: LedgerObjectsService) { }

  async getStream(id: string, blockIndex?: number): Promise<StreamEntry> {
    const object = await this.ledgerObjectService.getObject(STREAM_LABEL, id, blockIndex);
    return parseStream(object);
  }

  async getStreamCollection(params?: StreamParams): Promise<Page<StreamEntry>> {
    const currentState = await this.ledgerObjectService.getObjects();
    let collection = extractStreamEntriesFromState(currentState);

    if (params?.uiType) {
      collection = collection.filter((entry) => isExported(entry.uiType) && entry.uiType === params.uiType);
    }

    if (params?.documentId) {
      const streamReferences = this.extractStreamReferencesFromState(currentState);
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

  async getStreamReference(id: string, blockIndex?: number): Promise<StreamReference> {
    const object = await this.ledgerObjectService.getObject(STREAM_REFERENCE_LABEL, id, blockIndex);
    return this.parseStreamReference(object);
  }

  async getStreamReferencesCollection(params?: StreamReferenceParams): Promise<Page<StreamReference>> {
    const currentState = await this.ledgerObjectService.getObjects();
    let collection = this.extractStreamReferencesFromState(currentState);

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

  parseStreamReference(obj: any): StreamReference {
    const streamReference = obj as StreamReference;
    return {
      ...streamReference,
      streamEntry: async () => isExported(streamReference.streamEntryId)
        ? await this.getStream(streamReference.streamEntryId)
        : undefined,
    };
  };

  private extractStreamReferencesFromState(state: LedgerState): StreamReference[] {
    return transformerFrom(this.parseStreamReference.bind(this))(state[STREAM_REFERENCE_LABEL]);
  }
}
