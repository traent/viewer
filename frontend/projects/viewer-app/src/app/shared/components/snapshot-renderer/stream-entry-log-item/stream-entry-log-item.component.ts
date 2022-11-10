import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LogItemImage, StreamEntrySnapshot } from '@viewer/models';
import { getProjectParticipantId, redactedClass, redactedValue, snapshotContent, snapshotParticipantLabel } from '@viewer/utils';
import { StreamEntryV0 } from '@ledger-objects';
import { ProjectParticipantService, parseStream } from '@viewer/services';

import { StreamLogDialogComponent } from '../../stream-log-dialog/stream-log-dialog.component';

// FIXME: this is something that could change after the workflow refactor: could we avoid to hard-code it?
const WORKFLOW_HANDLE_STREAM = 'switch_to';

const getStreamUpdateLabel = (isWorkflowTransition: boolean): string =>
  isWorkflowTransition
    ? 'i18n.SnapshotItem.OperationLabel.StreamEntry.workflowTransition'
    : 'i18n.SnapshotItem.OperationLabel.StreamEntry.update';

const getStreamCreationLabel = (isWorkflowTransition: boolean): string =>
  isWorkflowTransition
    ? 'i18n.SnapshotItem.OperationLabel.StreamEntry.workflowActivation'
    : 'i18n.SnapshotItem.OperationLabel.StreamEntry.creation';

@Component({
  selector: 'app-stream-entry-log-item',
  templateUrl: './stream-entry-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamEntryLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<StreamEntrySnapshot | null>(null);
  @Input() set snapshot(value: StreamEntrySnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }


  readonly itemImage$: Observable<LogItemImage> = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((snapshot) => snapshotContent<StreamEntryV0>(snapshot).machineName === WORKFLOW_HANDLE_STREAM
    ? {
      type: 'icon',
      icon: { custom: 'workflow' },
      bgColor: 'opal-bg-accent-100',
      textColor: 'opal-text-accent-500',
    }
    : {
      type: 'icon',
      icon: { custom: 'stream-overview' },
      bgColor: 'opal-bg-blue-100',
      textColor: 'opal-text-blue-600',
    }),
  );

  readonly projectParticipant$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (snapshot) => {
      const participantId = getProjectParticipantId(snapshot);
      return participantId
        ? await this.projectParticipantService.getProjectParticipant(participantId)
        : undefined;
    }),
    switchMap((projectParticipant) => snapshotParticipantLabel(projectParticipant)),
  );

  readonly props$ = combineLatest([
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$,
  ]).pipe(
    map(([snapshot, member]) => {
      const obj = snapshotContent<StreamEntryV0>(snapshot);
      const isWorkflowTransition = obj.machineName === WORKFLOW_HANDLE_STREAM;
      const streamStyle = redactedClass(obj.name, 'pointer');
      const streamName = redactedValue(obj.name);

      return {
        isWorkflowTransition,
        member,
        operation: snapshot.operation,
        streamName,
        streamStyle,
      };
    }),
  );

  readonly getStreamCreationLabel = getStreamCreationLabel;
  readonly getStreamUpdateLabel = getStreamUpdateLabel;

  constructor(
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: StreamEntrySnapshot | null): Promise<void> {
    if (pointerClasses === 'stream' && snapshot) {
      await firstValueFrom(this.dialog.open(StreamLogDialogComponent, {
        data: parseStream(snapshotContent<StreamEntryV0>(snapshot)),
        panelClass: 'opal-w-600px',
      }).afterClosed());
    }
  }
}
