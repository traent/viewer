import { load } from 'js-yaml';
import { isExportedAndDefined, isRedacted, Redactable, RedactedMarker, RedactedType } from '@traent/ngx-components';

import { LedgerResource, RedactableBox } from '../ledger';
import {
  WorkflowFormat,
  WorkflowsDsLv0Workflow,
  WorkflowsDsLv1Workflow,
  WorkflowStateV0,
  WorkflowV0,
} from '../ledger-objects/models';

export const WORKFLOW_LABEL = 'WorkflowV0';
export const WORKFLOW_STATE_LABEL = 'WorkflowStateV0';

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

export type WorkflowState = RedactableBox<WorkflowStateV0> & LedgerResource;

export const parseWorkflowState = (obj: any): WorkflowState => obj as any;

export const parseWorkflow = (obj: any): Workflow => {
  // FIXME: this should be checked
  const workflow = obj;

  let dsl: WorkflowDSL | undefined;

  try {
    if (isExportedAndDefined(workflow.definition)) {
      dsl = parseWorkflowDSL(workflow);
    }
  } catch {
    // Ignore parsing errors and leave `undefined` as dsl value
  }

  return {
    ...workflow,
    dsl,
    lastState: dsl && getWorkflowStateLabel(workflow.state, dsl),
    getStateLabel: (stateId?: Redactable<string>) => dsl && stateId && getWorkflowStateLabel(stateId, dsl),
  };
};

const parseWorkflowDSL = (workflow: any): WorkflowDSL => {
  let definition;
  if (workflow.format === WorkflowFormat.Yaml) {
    definition = load(workflow.definition) as any;
  } else if (workflow.format === WorkflowFormat.Json) {
    definition = JSON.parse(workflow.definition);
  }

  let version: 0 | 1;
  if (definition?.version?.startsWith('0.')) {
    version = 0;
  } else if (definition?.version?.startsWith('1.')) {
    version = 1;
  } else {
    throw new Error('Unsupported workflow version');
  }

  return {
    version,
    definition,
  };
};

const getWorkflowStateLabel = (stateId: RedactedType | string | undefined, dsl: WorkflowDSL): string | undefined | RedactedType => {
  if (!stateId) {
    return;
  }

  if (isRedacted(stateId)) {
    return RedactedMarker;
  }

  if (dsl.version === 0) {
    return dsl.definition.states && dsl.definition.states?.find((state: any) => state.id === stateId)?.name;
  } else {
    return dsl.definition.states[stateId]?.name;
  }
};
