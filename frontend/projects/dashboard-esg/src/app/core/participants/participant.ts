import { UIPaginationParams } from '@traent/ngx-paginator';
import { Observable } from 'rxjs';

import { BlockIndexed, LedgerResource, RedactableBox } from '../ledger';
import { ProjectParticipantRole, ProjectParticipantV0 } from '../ledger-objects/models';
import { Member } from '../member';
import { Organization } from '../organization';

export const PROJECT_PARTICIPANT_LABEL = 'ProjectParticipantV0';

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
  tagId: string;
}> & UIPaginationParams
  & BlockIndexed;

export type OrganizationCollectionParams = UIPaginationParams & BlockIndexed;
