import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { WorkflowV0 } from '@ledger-objects';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { WorkflowSnapshot, Workflow } from '@viewer/models';
import { getChanges, getWorkflowStateLabel, parseWorkflow } from '@viewer/utils';
import { redactedClass, redactedValue, snapshotContent, workflowSnapshotImage } from '@viewer/utils';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const getWorkflowName = (current: Workflow): string | undefined => current.dsl?.definition?.name;

const getIsWorkflowStateTransition = (snapshot: WorkflowSnapshot) => snapshot.operation === 'update'
  && getChanges(snapshot.delta, ['state']).length === 1;

@Component({
  selector: 'app-workflow-log-item',
  templateUrl: './workflow-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<WorkflowSnapshot | null>(null);
  @Input() set snapshot(value: WorkflowSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage = workflowSnapshotImage;

  readonly props$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((snapshot) => {
      const workflow = parseWorkflow(snapshotContent<WorkflowV0>(snapshot));
      const workflowName = redactedValue(getWorkflowName(workflow));
      const workflowNameClass = redactedClass(getWorkflowName(workflow));
      const fromState = redactedValue(getWorkflowStateLabel(snapshot?.previous?.state, workflow.dsl));
      const fromStateStyle = redactedClass(snapshot?.previous?.state);
      const toState = redactedValue(getWorkflowStateLabel(snapshot.delta.state, workflow.dsl));
      const toStateStyle = redactedClass(snapshot.delta.state);
      const isWorkflowStateTransition = getIsWorkflowStateTransition(snapshot);

      return {
        fromState,
        fromStateStyle,
        isWorkflowStateTransition,
        operation: snapshot.operation,
        toState,
        toStateStyle,
        workflow,
        workflowName,
        workflowNameClass,
      };
    }),
  );
}
