import {
  DocumentV0,
  ProjectParticipantV0,
  ProjectV0,
  StreamEntryV0,
  StreamReferenceV0,
  TagEntryV0,
  TagV0,
  ThreadMessageEntityV0,
  ThreadMessageV0,
  ThreadReferenceV0,
  ThreadV0,
  WorkflowV0,
} from '@ledger-objects';
import {
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
} from '@viewer/services';
import { MaterialOrCustomIcon } from '@traent/ngx-components';
import { UIPaginationParams } from '@traent/ngx-paginator';
import { Observable } from 'rxjs';

import { BlockIdentification } from './block-table';
import { RedactableBox } from './ledger-resource';

export type Snapshot<T, L> = {
  id: string;
  type: L;
  updatedInBlock: BlockIdentification;
  createdInBlock: BlockIdentification;
} & ({
  operation: 'creation';
  delta: RedactableBox<T>;
  previous: undefined;
} | {
  operation: 'update' | 'deletion';
  delta: Partial<RedactableBox<T>>;
  previous: RedactableBox<T>;
});

export type DocumentSnapshot = Snapshot<DocumentV0, typeof DOCUMENT_LABEL>;
export type ProjectParticipantSnapshot = Snapshot<ProjectParticipantV0, typeof PROJECT_PARTICIPANT_LABEL>;
export type ProjectSnapshot = Snapshot<ProjectV0, typeof PROJECT_LABEL>;
export type StreamEntrySnapshot = Snapshot<StreamEntryV0, typeof STREAM_LABEL>;
export type StreamReferenceSnapshot = Snapshot<StreamReferenceV0, typeof STREAM_REFERENCE_LABEL>;
export type TagEntrySnapshot = Snapshot<TagEntryV0, typeof TAG_ENTRY_LABEL>;
export type TagSnapshot = Snapshot<TagV0, typeof TAG_LABEL>;
export type ThreadMessageEntitySnapshot = Snapshot<ThreadMessageEntityV0, typeof THREAD_MESSAGE_ENTITY_LABEL>;
export type ThreadMessageSnapshot = Snapshot<ThreadMessageV0, typeof THREAD_MESSAGE_LABEL>;
export type ThreadReferenceSnapshot = Snapshot<ThreadReferenceV0, typeof THREAD_REFERENCE_LABEL>;
export type ThreadSnapshot = Snapshot<ThreadV0, typeof THREAD_LABEL>;
export type WorkflowSnapshot = Snapshot<WorkflowV0, typeof WORKFLOW_LABEL>;

export type ResourceSnapshot =
  | DocumentSnapshot
  | ProjectParticipantSnapshot
  | ProjectSnapshot
  | StreamEntrySnapshot
  | StreamReferenceSnapshot
  | TagEntrySnapshot
  | TagSnapshot
  | ThreadMessageEntitySnapshot
  | ThreadMessageSnapshot
  | ThreadReferenceSnapshot
  | ThreadSnapshot
  | WorkflowSnapshot;

export type SnapshotParams = Partial<{
  id: string;
  types: ResourceSnapshot['type'][];
  from: number;
  to: number;
}> & UIPaginationParams;

export type UISnapshot = {
  description$: Observable<string>;
  image$: Observable<LogItemImage>;
  date?: string;
  resourceSnapshot: ResourceSnapshot;
};

export interface UISnapshotHandler<T extends ResourceSnapshot> {
  convert: (snapshot: T) => Promise<UISnapshot>;
  clickHandler?: (key: string, snapshot: T) => Promise<void>;
}

export type LogItemImage = {
  src: string | null | undefined;
  type: 'avatar';
} | {
  bgColor: string;
  icon: MaterialOrCustomIcon;
  textColor: string;
  type: 'icon';
} | {
  bgColor: string;
  icon: MaterialOrCustomIcon;
  src: string | null | undefined;
  textColor: string;
  type: 'doubleAvatar';
};
