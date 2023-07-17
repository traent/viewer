import { TagV0, TagEntryV0, TagType } from '@ledger-objects';
import { ResourceCollectionParams } from '@viewer/utils';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type Tag = RedactableBox<TagV0> & LedgerResource;

export type TagParams = Partial<{
  color: string;
  name: string;
  description: string;
  type: TagType;
}> & ResourceCollectionParams<Tag>;

export type TagEntry = RedactableBox<TagEntryV0> & LedgerResource;

export type TagEntryParams = Partial<{
  tagId: string;
  taggedResourceId: string;
}> & ResourceCollectionParams<TagEntry>;
