import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThreadMessageV0 } from '@ledger-objects';
import { isExportedAndDefined } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { LogItemImage, Thread, ThreadMessageSnapshot, WorkflowParticipant } from '@viewer/models';
import { ProjectParticipantService, ThreadService } from '@viewer/services';
import {
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
  snapshotParticipantLabel, workflowSnapshotImage,
} from '@viewer/utils';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { ThreadLogDialogComponent } from '../../thread-log-dialog/thread-log-dialog.component';

@Component({
  selector: 'app-thread-message-log-item',
  templateUrl: './thread-message-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadMessageLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

  private readonly snapshot$ = new BehaviorSubject<ThreadMessageSnapshot | null>(null);
  @Input() set snapshot(value: ThreadMessageSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

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
  );

  readonly itemImage$: Observable<LogItemImage> = this.projectParticipant$.pipe(
    switchMap((projectParticipant) => {
      if (projectParticipant === WorkflowParticipant) {
        return of(workflowSnapshotImage);
      } else if (projectParticipant) {
        return projectParticipant.agent$.pipe(
          map((m) => ({
            type: 'avatar' as const,
            src: m?.avatar
              ?? m?.type
              ? {
                custom: 'things',
              }
              : undefined,
          })),
        );
      }

      return of({
        type: 'avatar' as const,
        src: undefined,
      });
    }),
  );

  readonly props$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$.pipe(switchMap(snapshotParticipantLabel)),
  ]).pipe(
    switchMap(async ([ledgerId, snapshot, member]) => {
      const thread = await this.getThread(snapshot, ledgerId);
      const threadName = redactedValue(thread?.name);
      const threadStyle = redactedClass(thread?.name, 'pointer');

      return {
        member,
        operation: snapshot.operation,
        threadName,
        threadStyle,
      };
    }),
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly threadService: ThreadService,
  ) { }

  private async getThread(snapshot: ThreadMessageSnapshot, ledgerId: string | undefined): Promise<Thread | undefined> {
    const threadId = snapshotContent<ThreadMessageV0>(snapshot).threadId;
    return isExportedAndDefined(threadId)
      ? this.threadService.getThread({ ledgerId, id: threadId, blockIndex: snapshot.updatedInBlock.index })
      : undefined;
  }

  async clickHandler(pointerClasses: string, snapshot: ThreadMessageSnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'thread' && snapshot) {
      const thread = await this.getThread(snapshot, ledgerId);
      if (!thread) {
        return;
      }

      await firstValueFrom(this.dialog.open(ThreadLogDialogComponent, {
        data: { ledgerId, thread },
        panelClass: 'tw-w-[600px]',
      }).afterClosed());
    }
  }
}
