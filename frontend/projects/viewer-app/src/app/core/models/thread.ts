import { ThreadMessageEntityV0, ThreadMessageV0, ThreadReferenceV0, ThreadV0 } from '@ledger-objects';
import { LedgerBlockIndex, ResourceCollectionParams, SortableResource } from '@viewer/utils';

import { LedgerResource, RedactableBox } from './ledger-resource';
import { ProjectParticipant } from './project-participant';

export type Thread = RedactableBox<ThreadV0> & LedgerResource;

export type ThreadMessageEntity = RedactableBox<ThreadMessageEntityV0> & LedgerResource;
export type ThreadReference = RedactableBox<ThreadReferenceV0> & LedgerResource;
export type ThreadMessage = RedactableBox<ThreadMessageV0> & LedgerResource;

export type ThreadParams = Partial<{
  isResolved: boolean;
  documentId: string;
}> & ResourceCollectionParams<Thread>;

export type ThreadMessageParams = Partial<{
  threadId: string;
}> & ResourceCollectionParams<ThreadMessage>;

export type ThreadMessageEntityParams = Partial<{
  threadMessageId: string;
}> & LedgerBlockIndex & SortableResource<ThreadMessageEntity>;

export type ThreadReferenceParams = Partial<{
  threadId: string;
}> & ResourceCollectionParams<ThreadReference>;

export type ThreadParticipantParams = ResourceCollectionParams<ProjectParticipant>;

/** UI Models */
export type ThreadCategories = 'all' | 'open' | 'resolved';
