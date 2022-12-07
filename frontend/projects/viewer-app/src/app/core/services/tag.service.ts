import { Injectable } from '@angular/core';
import { isExportedAndDefined } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { Tag, TagEntry, TagEntryParams, TagParams } from '../models';
import { collectionSort, collectionToPage, ResourceParams, transformerFrom } from '../utils';

export const TAG_LABEL = 'TagV0';
export const TAG_ENTRY_LABEL = 'TagEntryV0';

const parseTag = (obj: any): Tag => ({ ...obj });
const extractTagsFromState = (state: LedgerState): Tag[] => transformerFrom(parseTag)(state[TAG_LABEL]);

const parseTagEntry = (obj: any): TagEntry => obj as TagEntry;
const extractTagEntriesFromState = (state: LedgerState): TagEntry[] => transformerFrom(parseTagEntry)(state[TAG_ENTRY_LABEL]);

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getTag({ id, blockIndex, ledgerId }: ResourceParams): Promise<Tag> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(TAG_LABEL, id, blockIndex);
    return parseTag(object);
  }

  async getTagCollection(params?: TagParams): Promise<Page<Tag>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractTagsFromState(currentState);

    if (params?.name) {
      const name = params.name;
      collection = collection.filter((tag) => isExportedAndDefined(tag.name) && tag.name.includes(name));
    }

    if (params?.description) {
      const description = params.description;
      collection = collection.filter((tag) => isExportedAndDefined(tag.description) && tag.description.includes(description));
    }

    if (params?.type) {
      const type = params.type;
      collection = collection.filter((tag) => tag.type === type);
    }

    if (params?.color) {
      const color = params.color;
      collection = collection.filter((tag) => tag.color === color);
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'name', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  async getTagEntry({ ledgerId, id, blockIndex }: ResourceParams): Promise<TagEntry> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(TAG_ENTRY_LABEL, id, blockIndex);
    return parseTagEntry(object);
  }

  async getTagEntryCollection(params?: TagEntryParams): Promise<Page<TagEntry>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractTagEntriesFromState(currentState);

    if (params?.tagId) {
      const tagId = params.tagId;
      collection = collection.filter((tagEntry) => tagEntry.tagId === tagId);
    }

    if (params?.taggedResourceId) {
      const taggedResourceId = params.taggedResourceId;
      collection = collection.filter((tagEntry) => tagEntry.taggedResourceId === taggedResourceId);
    }

    return collectionToPage(
      collectionSort(collection, params
        ? (orderParams) => orderParams.updatedAt
        : 'updatedAt', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }
}
