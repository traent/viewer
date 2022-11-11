import { TagV0, TagEntryV0, TagType } from '@ledger-objects';
import { UIPaginationParams } from '@traent/ngx-paginator';
import { BlockIndexed, SortableResource } from '@viewer/utils';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type Tag = RedactableBox<TagV0> & LedgerResource;

export type TagParams = Partial<{
  color: string;
  name: string;
  description: string;
  type: TagType;
}> & SortableResource<Tag> & UIPaginationParams;

export type TagEntry = RedactableBox<TagEntryV0> & LedgerResource & {
  tag: () => Promise<Tag | undefined>;
};

export type TagEntryParams = Partial<{
  tagId: string;
  taggedResourceId: string;
}> & SortableResource<TagEntry>
  & UIPaginationParams
  & BlockIndexed;
