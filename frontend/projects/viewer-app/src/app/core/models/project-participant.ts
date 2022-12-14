import { ProjectParticipantRole, ProjectParticipantV0 } from '@ledger-objects';
import { BlockIndexed, SortableResource } from '@viewer/utils';
import { UIPaginationParams } from '@traent/ngx-paginator';
import { Observable } from 'rxjs';

import { LedgerResource, RedactableBox } from './ledger-resource';
import { Member } from './member';
import { Organization } from './organization';

/**
 * `WorkflowParticipant` is a unique marker that identifies the workflow participant.
 *
 * Note: It would have been a better solution to use a `symbol` or an anonymous class, but
 * some type issues were in place.
 */
export const WorkflowParticipant = 'workflow_participant_symbol';
export type WorkflowParticipantType = typeof WorkflowParticipant;

export type ProjectParticipant = LedgerProjectParticipant | WorkflowParticipantType;
export type LedgerProjectParticipant = RedactableBox<ProjectParticipantV0> & LedgerResource & {
  member$: Observable<Member | undefined>;
  organization$: Observable<Organization | undefined>;
};

export type ProjectParticipantParams = Partial<{
  organizationId: string;
  roles: ProjectParticipantRole[];
}> & SortableResource<ProjectParticipant>
  & UIPaginationParams
  & BlockIndexed;

export type OrganizationCollectionParams = UIPaginationParams & BlockIndexed;
