import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThreadV0 } from '@ledger-objects';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { LogItemImage, ThreadSnapshot } from '@viewer/models';
import { parseThread, ProjectParticipantService } from '@viewer/services';
import {
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
  snapshotParticipantLabel,
} from '@viewer/utils';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

  private readonly snapshot$ = new BehaviorSubject<ThreadSnapshot | null>(null);
  @Input() set snapshot(value: ThreadSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'thread-reference' },
    bgColor: 'tw-bg-cyan-100',
    textColor: 'tw-text-cyan-600',
  };

  private readonly projectParticipant$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(async ([ledgerId, snapshot]) => {
      const participantId = getProjectParticipantId(snapshot);
      return participantId
        ? await this.projectParticipantService.getProjectParticipant({ ledgerId, id: participantId })
        : undefined;
    }),
    switchMap(snapshotParticipantLabel),
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

  async clickHandler(pointerClasses: string, snapshot: ThreadSnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'thread' && snapshot) {
      const thread = parseThread(snapshotContent<ThreadV0>(snapshot));
      await firstValueFrom(this.dialog.open(ThreadLogDialogComponent, {
        data: { ledgerId, thread },
        panelClass: 'tw-w-[600px]',
      }).afterClosed());
    }
  }
}
