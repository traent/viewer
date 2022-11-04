import { Component, EventEmitter, Input, Output } from '@angular/core';

import { UIWorkflowState } from '../../workflow';

@Component({
  selector: 'app-workflow-states',
  templateUrl: './workflow-states.component.html',
  styleUrls: ['./workflow-states.component.scss'],
})
export class WorkflowStatesComponent {
  @Input() states: UIWorkflowState[] | null = [];

  @Output() readonly showState = new EventEmitter<UIWorkflowState | undefined>();

  private selectedState?: UIWorkflowState;

  toggleStateHandler(state: UIWorkflowState) {
    if (this.selectedState) {
      this.selectedState.isSelected = false;
    }

    if (this.selectedState && this.selectedState.stateId === state.stateId) {
      this.selectedState = undefined;
      this.showState.next(undefined);
      return;
    }

    state.isSelected = true;
    this.selectedState = state;

    this.showState.next(state);
  }
}
