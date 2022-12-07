import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isExported, isExportedAndDefined } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Thread } from '@viewer/models';
import { ProjectParticipantService, ThreadService, LedgerAccessorService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { BehaviorSubject, switchMap } from 'rxjs';

@Component({
  selector: 'app-thread-overview',
  templateUrl: './thread-overview.component.html',
  styleUrls: ['./thread-overview.component.scss'],
})
export class ThreadOverviewComponent {
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  private readonly thread$ = new BehaviorSubject<Thread | null>(null);
  @Input() set thread(value: Thread | null) {
    this.thread$.next(value);
  }
  get thread(): Thread | null {
    return this.thread$.value;
  }

  readonly blockAcknowledgementsInfo$ = this.thread$.pipe(
    isNotNullOrUndefined(),
    switchMap((thread) => this.ledgerAccessorService.getLedger().getAcknowledgementStatus(thread.updatedInBlock.index)),
  );

  readonly editor$ = this.thread$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (thread) => isExported(thread.updaterId)
      ? this.projectParticipantService.getProjectParticipant({ id: thread.updaterId })
      : undefined,
    ),
  );

  readonly assignee$ = this.thread$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (thread) => isExportedAndDefined(thread.assigneeId)
      ? this.projectParticipantService.getProjectParticipant({ id: thread.assigneeId })
      : undefined,
    ),
  );

  @Input() participantsCount: number | null = null;
  @Input() referencesCount: number | null = null;

  @Output() participantsClick = new EventEmitter<void>();
  @Output() referencesClick = new EventEmitter<void>();

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    readonly dialog: MatDialog,
    readonly threadService: ThreadService,
  ) { }
}
