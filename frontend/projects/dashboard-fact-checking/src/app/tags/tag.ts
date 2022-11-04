import { BlockIndexed, LedgerResource, RedactableBox } from '../ledger';
import { TagEntryV0, TagType, TagV0 } from '../ledger-objects/models';

export const TAG_LABEL = 'TagV0';
export const TAG_ENTRY_LABEL = 'TagEntryV0';

export type TagParams = Partial<{
  color: string;
  name: string;
  description: string;
  type: TagType;
}>;

export type Tag = RedactableBox<TagV0> & LedgerResource;

export type TagEntry = RedactableBox<TagEntryV0> & LedgerResource & {
  tag: () => Promise<Tag | undefined>;
};

export type TagEntryParams = Partial<{
  tagId: string;
  taggedResourceId: string;
}> & BlockIndexed;

export const parseTag = (obj: any): Tag => ({ ...obj });
