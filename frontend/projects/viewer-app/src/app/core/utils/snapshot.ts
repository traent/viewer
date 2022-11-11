import { LogItemImage, ProjectParticipant, RedactableBox, ResourceSnapshot, Snapshot, WorkflowParticipant } from '@viewer/models';
import {
  STREAM_LABEL,
  STREAM_REFERENCE_LABEL,
  PROJECT_LABEL,
  PROJECT_PARTICIPANT_LABEL,
  WORKFLOW_LABEL,
  DOCUMENT_LABEL,
  THREAD_LABEL,
  THREAD_MESSAGE_LABEL,
  THREAD_REFERENCE_LABEL,
  TAG_LABEL,
  TAG_ENTRY_LABEL,
} from '@viewer/services';
import { isRedacted, isRedactedOrUndefined } from '@traent/ngx-components';
import { map, Observable, of } from 'rxjs';

export const getProjectParticipantId = (snapshot: ResourceSnapshot): string | undefined =>
  isRedacted(snapshot.delta.updaterId) ? undefined : snapshot.delta.updaterId;

export const snapshotContent = <T>(snapshot: Snapshot<T, string>): RedactableBox<T> => {
  const obj = snapshot.operation === 'creation'
    ? snapshot.delta
    : {
      ...snapshot.previous,
      ...snapshot.delta,
    };
  return obj;
};

export const redactedClass = (value: any, defaultClass = ''): string => isRedactedOrUndefined(value) ? 'redacted' : defaultClass;

export const redactedValue = (value: any): 'Redacted' | string => isRedactedOrUndefined(value) ? 'Redacted' : value;

interface SnapshotParticipantData {
  name: string;
  class: string;
}
export const snapshotParticipantLabel = (value?: ProjectParticipant): Observable<SnapshotParticipantData> => {
  if (value === WorkflowParticipant) {
    return of({
      name: 'The workflow',
      class: '',
    });
  }

  const source$ = value?.member$ ?? of(undefined);
  return source$.pipe(map((member) => ({
    name: redactedValue(member?.fullName),
    class: redactedClass(member),
  })));
};

export const workflowSnapshotImage: LogItemImage = {
  type: 'icon',
  icon: { custom: 'workflow' },
  bgColor: 'opal-bg-accent-100',
  textColor: 'opal-text-accent-500',
};

export type ProjectLogFilterType = 'all' | 'project' | 'stream' | 'threads' | 'documents';

export const snapshotTypeFromFilter = (f: ProjectLogFilterType): ResourceSnapshot['type'][] => {
  switch (f) {
    case 'stream': return [
      STREAM_LABEL,
      STREAM_REFERENCE_LABEL,
    ];
    case 'project': return [
      PROJECT_LABEL,
      PROJECT_PARTICIPANT_LABEL,
      WORKFLOW_LABEL,
    ];
    case 'documents': return [DOCUMENT_LABEL];
    case 'threads': return [
      THREAD_LABEL,
      THREAD_MESSAGE_LABEL,
      THREAD_REFERENCE_LABEL,
    ];
    default: return [
      STREAM_LABEL,
      STREAM_REFERENCE_LABEL,
      PROJECT_LABEL,
      PROJECT_PARTICIPANT_LABEL,
      WORKFLOW_LABEL,
      DOCUMENT_LABEL,
      TAG_ENTRY_LABEL,
      TAG_LABEL,
      THREAD_LABEL,
      THREAD_MESSAGE_LABEL,
      THREAD_REFERENCE_LABEL,
    ];
  }
};

export const getChanges = <T extends object, K extends keyof T>(delta: T, targetKeys: K[]): K[] => {
  const changes: K[] = [];
  for (const key of targetKeys) {
    if (delta.hasOwnProperty(key)) {
      changes.push(key);
    }
  }
  return changes;
};
