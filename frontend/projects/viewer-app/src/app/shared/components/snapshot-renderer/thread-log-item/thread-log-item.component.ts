import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LogItemImage, ThreadSnapshot } from '@viewer/models';
import {
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
  snapshotParticipantLabel,
} from '@viewer/utils';
import { parseThread, ProjectParticipantService } from '@viewer/services';
import { ThreadV0 } from '@ledger-objects';

import { ThreadLogDialogComponent } from '../../thread-log-dialog/thread-log-dialog.component';

const getThreadUpdateType = (snapshot: ThreadSnapshot): 'name' | 'resolved' | 'unresolved' | 'generic' => {
  if (snapshot.delta?.isResolved !== undefined) {
    return snapshot.delta.isResolved ? 'resolved' : 'unresolved';
  }
  if (snapshot.delta?.name) {
    return 'name';
  }
  return 'generic';
};

const getThreadUpdateLabel = (type: 'name' | 'resolved' | 'unresolved' | 'generic'): string => {
  switch (type) {
    case 'name': return 'i18n.SnapshotItem.OperationLabel.Thread.rename';
    case 'resolved': return 'i18n.SnapshotItem.OperationLabel.Thread.resolution';
    case 'unresolved': return 'i18n.SnapshotItem.OperationLabel.Thread.open';
    default: return 'i18n.SnapshotItem.OperationLabel.Thread.update';
  }
};

@Component({
  selector: 'app-thread-log-item',
  templateUrl: './thread-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<ThreadSnapshot | null>(null);
  @Input() set snapshot(value: ThreadSnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'thread-reference' },
    bgColor: 'opal-bg-ottanio-100',
    textColor: 'opal-text-ottanio-600',
  };

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
      const thread = snapshotContent<ThreadV0>(snapshot);
      const threadName = redactedValue(thread?.name);
      const previousThreadName = redactedValue(snapshot.previous?.name);
      const previousThreadClass = redactedClass(snapshot.previous?.name);
      const threadStyle = redactedClass(thread?.name, 'pointer');

      return {
        member,
        operation: snapshot.operation,
        previousThreadClass,
        previousThreadName,
        threadName,
        threadStyle,
        updateType: getThreadUpdateType(snapshot),
      };
    }),
  );

  readonly getThreadUpdateLabel = getThreadUpdateLabel;

  constructor(
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: ThreadSnapshot | null): Promise<void> {
    if (pointerClasses === 'thread' && snapshot) {
      await firstValueFrom(this.dialog.open(ThreadLogDialogComponent, {
        data: parseThread(snapshotContent<ThreadV0>(snapshot)),
        panelClass: 'opal-w-600px',
      }).afterClosed());
    }
  }
}
