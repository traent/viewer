import { Injectable } from '@angular/core';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { CrossProjectParams as CrossProjectReferenceParams, CrossProjectReference } from '../models/cross-project-reference';
import { LedgerResource } from '../models/ledger-resource';
import { collectionSort, collectionToPage, ResourceParams, transformerFrom } from '../utils/ledger-objects';

export const CROSS_PROJECT_REFERENCE_LABEL = 'CrossProjectReferenceV0';

export const parseCrossProjectReference = (reference: LedgerResource) => reference as CrossProjectReference;
export const extractCrossProjectReferenceFromState = (state: LedgerState): CrossProjectReference[] =>
  transformerFrom(parseCrossProjectReference)(state[CROSS_PROJECT_REFERENCE_LABEL]);

@Injectable({ providedIn: 'root' })
export class CrossProjectReferenceService {
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getCrossProjectReference({ id, blockIndex, ledgerId }: ResourceParams) {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(CROSS_PROJECT_REFERENCE_LABEL, id, blockIndex);
    return parseCrossProjectReference(object);
  }

  async getCrossProjectReferenceCollection(params?: CrossProjectReferenceParams) {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractCrossProjectReferenceFromState(currentState);

    if (params?.projectId) {
      collection = collection.filter((reference) => reference.projectId === params?.projectId);
    }

    if (params?.targetId) {
      collection = collection.filter((reference) => reference.targetId === params?.targetId);
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'updatedAt', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }
}
