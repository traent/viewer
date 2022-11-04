import { WorkflowsDsLv0Workflow, WorkflowsDsLv1Workflow, WorkflowV0 } from '@ledger-objects';
import { Redactable } from '@traent/ngx-components';

import { LedgerResource, RedactableBox } from './ledger-resource';

/**
 * The Workflow operates as a proper project participant on version 1 of workflows.
 * It is identified via its ID, exactly as happens with any other participant.
 * The Workflow ID is the null UUID value.
 */
export const WorkflowParticipantID = '00000000-0000-0000-0000-000000000000';

export type WorkflowDSLUnion = WorkflowsDsLv0Workflow | WorkflowsDsLv1Workflow;

export type WorkflowDSL = {
  version: number;
  definition: WorkflowDSLUnion;
} & ({
  version: 0;
  definition: WorkflowsDsLv0Workflow;
} | {
  version: 1;
  definition: WorkflowsDsLv1Workflow;
});

export type Workflow = RedactableBox<WorkflowV0> & LedgerResource & Partial<{
  dsl: WorkflowDSL;
  lastState: Redactable<string>;
}> & {
  getStateLabel: (stateId?: Redactable<string>) => Redactable<string> | undefined;
};
