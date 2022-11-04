import { WorkflowFormat } from '@ledger-objects';
import { Workflow, WorkflowDSL, WorkflowState } from '@viewer/models';
import { load } from 'js-yaml';
import { RedactedType, isRedacted, RedactedMarker, isExportedAndDefined, Redactable } from '@traent/ngx-components';

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
