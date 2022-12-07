import { Injectable } from '@angular/core';
import { isExportedAndDefined } from '@traent/ngx-components';
import { Page, UIPaginationParams } from '@traent/ngx-paginator';

import { collectionToPage } from '../collection';
import { LedgerContextService } from '../ledger';
import { parseTag, Tag, TagEntry, TagEntryParams, TagParams, TAG_ENTRY_LABEL, TAG_LABEL } from './tag';

@Injectable({
  providedIn: 'root',
})
export class TagsService {

  constructor(
    private readonly ledgerContextService: LedgerContextService,
  ) {
  }

  async getTags(params?: TagParams): Promise<Tag[]> {
    let collection = await this.ledgerContextService.getAll(TAG_LABEL);
    collection = collection.map(parseTag);

    if (params?.type !== undefined) {
      const type = params.type;
      collection = collection.filter((tag: Tag) => tag.type === type);
    }

    return collection;
  }

  async getTag(id: string): Promise<Tag | undefined> {
    const data = await this.ledgerContextService.retrieve(id);
    return data && parseTag(data);
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    let collection = await this.ledgerContextService.getAll(TAG_LABEL);
    collection = collection.map(parseTag);

    return collection.find((tag: any) => tag.name === name);
  }

  async getTagEntries(params?: TagEntryParams & Partial<UIPaginationParams>): Promise<TagEntry[]> {
    let collection = await this.ledgerContextService.getAll(TAG_ENTRY_LABEL);
    collection = collection.map((i: any) => this.parseTagEntry(i));

    if (params?.tagId) {
      const tagId = params.tagId;
      collection = collection.filter((tagEntry: TagEntry) => tagEntry.tagId === tagId);
    }

    if (params?.taggedResourceId) {
      const taggedResourceId = params.taggedResourceId;
      collection = collection.filter((tagEntry: TagEntry) => tagEntry.taggedResourceId === taggedResourceId);
    }

    return collection;
  }

  async getTagEntryPage(params?: TagEntryParams & UIPaginationParams): Promise<Page<TagEntry>> {
    const items = await this.getTagEntries(params);
    return collectionToPage(
      items,
      params?.page,
      params?.limit,
    );
  }

  async getTagEntry(id: string) {
    const object = await this.ledgerContextService.retrieve(id);
    return this.parseTagEntry(object);
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
}
