import { Injectable } from '@angular/core';
import { isExportedAndDefined } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';

import { Tag, TagEntry, TagEntryParams, TagParams } from '../models';
import { collectionSort, collectionToPage, transformerFrom } from '../utils';
import { LedgerObjectsService, LedgerState } from './ledger-objects.service';

export const TAG_LABEL = 'TagV0';
export const TAG_ENTRY_LABEL = 'TagEntryV0';

const parseTag = (obj: any): Tag => ({ ...obj });
const extractTagsFromState = (state: LedgerState): Tag[] => transformerFrom(parseTag)(state[TAG_LABEL]);

@Injectable({ providedIn: 'root' })
export class TagService {
  constructor(private readonly ledgerObjectService: LedgerObjectsService) { }

  async getTag(id: string, blockIndex?: number): Promise<Tag> {
    const object = await this.ledgerObjectService.getObject(TAG_LABEL, id, blockIndex);
    return parseTag(object);
  }

  async getTagCollection(params?: TagParams): Promise<Page<Tag>> {
    const currentState = await this.ledgerObjectService.getObjects();
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

  async getTagEntry(id: string): Promise<TagEntry> {
    const object = await this.ledgerObjectService.getObject(TAG_ENTRY_LABEL, id);
    return this.parseTagEntry(object);
  }

  async getTagEntryCollection(params?: TagEntryParams, state?: LedgerState): Promise<Page<TagEntry>> {
    const currentState = state || await this.ledgerObjectService.getObjects(params?.blockIndex);
    let collection = this.extractTagEntriesFromState(currentState);

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

  private parseTagEntry(obj: any): TagEntry {
    const tagEntry = obj;
    return {
      ...tagEntry,
      tag: async () => isExportedAndDefined(tagEntry.tagId)
        ? await this.getTag(tagEntry.tagId)
        : undefined,
    };
  }

  private extractTagEntriesFromState(state: LedgerState): TagEntry[] {
    return transformerFrom(this.parseTagEntry.bind(this))(state[TAG_ENTRY_LABEL]);
  }
}
