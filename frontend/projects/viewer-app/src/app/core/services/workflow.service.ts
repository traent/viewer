import { Injectable } from '@angular/core';
import { Workflow, WorkflowState } from '@viewer/models';

import { LedgerObjectsService, LedgerState } from './ledger-objects.service';
import { parseWorkflow, parseWorkflowState, transformerFrom } from '../utils';

export const WORKFLOW_LABEL = 'WorkflowV0';
export const WORKFLOW_STATE_LABEL = 'WorkflowStateV0';

const extractWorkflowState = (state: LedgerState): WorkflowState[] =>
  transformerFrom(parseWorkflowState)(state[WORKFLOW_STATE_LABEL]);

const extractWorkflowsFromState = (state: LedgerState): Workflow[] =>
  transformerFrom(parseWorkflow)(state[WORKFLOW_LABEL]);

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  constructor(private readonly ledgerObjectService: LedgerObjectsService) { }

  async getProjectWorkflow(blockIndex?: number): Promise<Workflow | undefined> {
    const object = await this.ledgerObjectService.getObjects(blockIndex);
    const collection = extractWorkflowsFromState(object);
    const workflow = collection.length && collection[0];
    if (workflow && !workflow.lastState) {
      const collectionState = extractWorkflowState(object);
      const lastState = collectionState.find((state) => state.workflowId === workflow.id);
      workflow.lastState = lastState?.stateId;
      return workflow;
    }
    return workflow || undefined;
  }
}
