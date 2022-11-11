import { Injectable } from '@angular/core';
import { ResourceSnapshot, SnapshotParams } from '@viewer/models';
import { collectionSort, collectionToPage } from '@viewer/utils';
import { flatten } from '@traent/ts-utils';

import { DOCUMENT_LABEL } from './document.service';
import { LedgerSnapshot, LedgerObjectsService } from './ledger-objects.service';
import { PROJECT_LABEL } from './project.service';
import { PROJECT_PARTICIPANT_LABEL } from './project-participant.service';
import { STREAM_LABEL, STREAM_REFERENCE_LABEL } from './stream.service';
import { THREAD_LABEL, THREAD_MESSAGE_LABEL, THREAD_MESSAGE_ENTITY_LABEL, THREAD_REFERENCE_LABEL } from './thread.service';
import { WORKFLOW_LABEL } from './workflow.service';
import { TAG_ENTRY_LABEL, TAG_LABEL } from './tag.service';

const isResourceSnapshot = (snapshot: LedgerSnapshot): snapshot is LedgerSnapshot & ResourceSnapshot =>
  // FIXME: this should be a union type or a type that ensures no type is missing
  [
    DOCUMENT_LABEL,
    PROJECT_LABEL,
    PROJECT_PARTICIPANT_LABEL,
    STREAM_LABEL,
    STREAM_REFERENCE_LABEL,
    TAG_ENTRY_LABEL,
    TAG_LABEL,
    THREAD_LABEL,
    THREAD_MESSAGE_ENTITY_LABEL,
    THREAD_MESSAGE_LABEL,
    THREAD_REFERENCE_LABEL,
    WORKFLOW_LABEL,
  ].includes(snapshot.type);

const parseSnapshot = (snapshot: LedgerSnapshot): ResourceSnapshot | undefined => {
  if (isResourceSnapshot(snapshot)) {
    return snapshot;
  } else {
    throw new Error(`Unsupported snapshot type: ${snapshot.type}`);
  }
};

@Injectable({ providedIn: 'root' })
export class SnapshotService {
  constructor(private readonly ledgerObjectService: LedgerObjectsService) { }

  async getSnapshotCollection(params?: SnapshotParams) {
    const history = await this.ledgerObjectService.getHistory(params?.from, params?.to);
    let collection = flatten(Object.values(history)).map((v) => {
      try {
        return parseSnapshot(v);
      } catch {
        return undefined;
      }
    }).filter((v): v is ResourceSnapshot => v !== undefined);

    if (params?.types) {
      const types = params.types;
      collection = collection.filter((snapshot) => types.includes(snapshot.type));
    }

    if (params?.id) {
      const id = params.id;
      collection = collection.filter((snapshot) => snapshot.id === id);
    }

    return collectionToPage(
      collectionSort(collection, (s) => s.updatedInBlock.index, 'desc'),
      params?.page,
      params?.limit,
    );
  }
}
