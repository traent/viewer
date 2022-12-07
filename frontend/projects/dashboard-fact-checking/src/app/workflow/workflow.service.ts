import { Injectable } from '@angular/core';

import { LedgerContextService } from '../ledger';
import { parseWorkflow, parseWorkflowState, Workflow, WORKFLOW_LABEL, WORKFLOW_STATE_LABEL } from './workflow';

@Injectable({
  providedIn: 'root',
})
export class WorkflowService {

  constructor(
    private readonly ledgerContextService: LedgerContextService,
  ) {
  }

  async getWorkflow(): Promise<Workflow | undefined> {
    let collection = await this.ledgerContextService.getAll(WORKFLOW_LABEL);
    collection = collection.map((i) => parseWorkflow(i));

    const workflow = collection.length && collection[0];

    if (workflow && !workflow.lastState) {
      let collectionState = await this.ledgerContextService.getAll(WORKFLOW_STATE_LABEL);
      collectionState = collectionState.map((i) => parseWorkflowState(i));
      const lastState = collectionState.find((state) => state.workflowId === workflow.id);
      workflow.lastState = lastState?.stateId;
      return workflow;
    }
    return workflow || undefined;
  }
}
