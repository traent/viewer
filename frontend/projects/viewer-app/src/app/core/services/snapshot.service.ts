import { Injectable } from '@angular/core';
import { ResourceSnapshot, SnapshotParams } from '@viewer/models';
import { collectionSort, collectionToPage } from '@viewer/utils';

import { CROSS_PROJECT_REFERENCE_LABEL } from './cross-project-reference.service';
import { DOCUMENT_LABEL } from './document.service';
import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerSnapshot } from './ledger-objects.service';
import { PROJECT_PARTICIPANT_LABEL } from './project-participant.service';
import { PROJECT_LABEL } from './project.service';
import { STREAM_LABEL, STREAM_REFERENCE_LABEL } from './stream.service';
import { TAG_ENTRY_LABEL, TAG_LABEL } from './tag.service';
import { THREAD_LABEL, THREAD_MESSAGE_LABEL, THREAD_MESSAGE_ENTITY_LABEL, THREAD_REFERENCE_LABEL } from './thread.service';
import { WORKFLOW_LABEL } from './workflow.service';

const isResourceSnapshot = (snapshot: LedgerSnapshot): snapshot is LedgerSnapshot & ResourceSnapshot =>
  // FIXME: this should be a union type or a type that ensures no type is missing
  [
    CROSS_PROJECT_REFERENCE_LABEL,
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
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getSnapshotCollection(params?: SnapshotParams) {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const history = await ledger.getHistory(params?.from, params?.to);
    let collection = history.map((v) => {
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
