import { Injectable } from '@angular/core';
import { Workflow, WorkflowState, WorkflowStateIdParams } from '@viewer/models';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { LedgerBlockIndex, parseWorkflow, parseWorkflowState, transformerFrom } from '../utils';

export const WORKFLOW_LABEL = 'WorkflowV0';
export const WORKFLOW_STATE_LABEL = 'WorkflowStateV0';

const extractWorkflowState = (state: LedgerState): WorkflowState[] =>
  transformerFrom(parseWorkflowState)(state[WORKFLOW_STATE_LABEL]);

const extractWorkflowsFromState = (state: LedgerState): Workflow[] =>
  transformerFrom(parseWorkflow)(state[WORKFLOW_LABEL]);

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getProjectWorkflow(params?: LedgerBlockIndex): Promise<Workflow | undefined> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const object = await ledger.getObjects(params?.blockIndex);
    const collection = extractWorkflowsFromState(object);
    return collection[0];
  }

  async getWorkflowState(workflowId: string, params?: LedgerBlockIndex): Promise<WorkflowState> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    const collection = extractWorkflowState(currentState);
    const object = collection.find((state) => state.workflowId === workflowId);
    return parseWorkflowState(object);
  }

  async getWorkflowStateId(params?: WorkflowStateIdParams) {
    if (!params?.workflow) {
      return undefined;
    } else if (params.workflow.state) {
      return params.workflow.state;
    } else {
      const state = await this.getWorkflowState(params.workflow.id, params);
      return state.stateId;
    }
  }
}
