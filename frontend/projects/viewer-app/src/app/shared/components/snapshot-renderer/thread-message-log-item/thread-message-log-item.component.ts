import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { isExportedAndDefined } from '@traent/ngx-components';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { LogItemImage, Thread, ThreadMessageSnapshot, WorkflowParticipant } from '@viewer/models';
import {
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
  snapshotParticipantLabel, workflowSnapshotImage,
} from '@viewer/utils';
import { ProjectParticipantService, ThreadService } from '@viewer/services';
import { ThreadMessageV0 } from '@ledger-objects';

import { ThreadLogDialogComponent } from '../../thread-log-dialog/thread-log-dialog.component';

@Component({
  selector: 'app-thread-message-log-item',
  templateUrl: './thread-message-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadMessageLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<ThreadMessageSnapshot | null>(null);
  @Input() set snapshot(value: ThreadMessageSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly projectParticipant$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((snapshot) => getProjectParticipantId(snapshot)),
    switchMap(async (participantId) => participantId
      ? await this.projectParticipantService.getProjectParticipant(participantId)
      : undefined,
    ),
  );

  readonly itemImage$: Observable<LogItemImage> = this.projectParticipant$.pipe(
    switchMap((projectParticipant) => {
      if (projectParticipant === WorkflowParticipant) {
        return of(workflowSnapshotImage);
      } else if (projectParticipant) {
        return projectParticipant.member$.pipe(
          map((m) => ({
            type: 'avatar' as const,
            src: m?.avatar,
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
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$,
  ]).pipe(
    switchMap(([snapshot, projectParticipant]) => snapshotParticipantLabel(projectParticipant).pipe(
      map((member) => ({ snapshot, member, projectParticipant })),
    )),
    switchMap(async ({ snapshot, member }) => {
      const thread = await this.getThread(snapshot);
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

  private async getThread(snapshot: ThreadMessageSnapshot): Promise<Thread | undefined> {
    const threadId = snapshotContent<ThreadMessageV0>(snapshot).threadId;
    return isExportedAndDefined(threadId) ? this.threadService.getThread(threadId, snapshot.updatedInBlock.index) : undefined;
  }

  async clickHandler(pointerClasses: string, snapshot: ThreadMessageSnapshot | null): Promise<void> {
    if (pointerClasses === 'thread' && snapshot) {
      const data = await this.getThread(snapshot);
      if (!data) {
        return;
      }

      await firstValueFrom(this.dialog.open(ThreadLogDialogComponent, { data, panelClass: 'opal-w-600px' }).afterClosed());
    }
  }
}
