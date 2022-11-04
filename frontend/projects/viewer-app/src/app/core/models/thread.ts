import { UIPaginationParams } from '@traent/ngx-paginator';
import { BlockIndexed, SortableResource } from '@viewer/utils';
import { ThreadMessageEntityV0, ThreadMessageV0, ThreadReferenceV0, ThreadV0 } from '@ledger-objects';

import { LedgerResource, RedactableBox } from './ledger-resource';
import { ProjectParticipant } from './project-participant';

export type Thread = RedactableBox<ThreadV0> & LedgerResource;

export type ThreadMessageEntity = RedactableBox<ThreadMessageEntityV0> & LedgerResource;
export type ThreadReference = RedactableBox<ThreadReferenceV0> & LedgerResource;
export type ThreadMessage = RedactableBox<ThreadMessageV0> & LedgerResource & {
  threadMessageEntities: () => Promise<ThreadMessageEntity[]>;
};

export type ThreadParams = Partial<{
  isResolved: boolean;
  documentId: string;
}> & SortableResource<Thread> & UIPaginationParams;

export type ThreadMessageParams = Partial<{
  threadId: string;
}> &  SortableResource<ThreadMessage> & UIPaginationParams;

export type ThreadMessageEntityParams = Partial<{
  threadMessageId: string;
}> &  SortableResource<ThreadMessageEntity> & UIPaginationParams;

export type ThreadReferenceParams = Partial<{
  threadId: string;
}> &  SortableResource<ThreadReference> & UIPaginationParams;

export type ThreadParticipantParams = SortableResource<ProjectParticipant>
  & UIPaginationParams
  & BlockIndexed;

/** UI Models */
export type ThreadCategories = 'all' | 'open' | 'resolved';
