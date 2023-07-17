import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isExported, isExportedAndDefined } from '@traent/ngx-components';
import { BlockIdentification, Thread } from '@viewer/models';
import { LedgerAccessorService, ProjectParticipantService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { from, of } from 'rxjs';

interface ThreadLogDialogData {
  ledgerId?: string;
  thread: Thread;
}

@Component({
  selector: 'app-thread-log-dialog',
  templateUrl: './thread-log-dialog.component.html',
  styleUrls: ['./thread-log-dialog.component.scss'],
})
export class ThreadLogDialogComponent {
  readonly ledgerId = this.data.ledgerId;
  readonly thread = this.data.thread;

  readonly editor$ = isExported(this.thread.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant({ ledgerId: this.ledgerId, id: this.thread.updaterId }))
    : of(undefined);

  readonly assignee$ = isExportedAndDefined(this.thread.assigneeId) && this.thread.assigneeId !== null
    ? from(this.projectParticipantService.getProjectParticipant({ ledgerId: this.ledgerId, id: this.thread.assigneeId }))
    : of(undefined);

  readonly blockAcknowledgementsInfo$ = this.ledgerAccessorService.getLedger(this.ledgerId)
    .getAcknowledgementStatus(this.thread.updatedInBlock.index);

  readonly openAcknowledgementsDialog = (block: BlockIdentification) =>
    bindOpenAcknowledgementsDialog(this.dialog)(block, this.ledgerId);

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: ThreadLogDialogData,
    private readonly dialog: MatDialog,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly router: Router,
  ) { }

  navigateThread() {
    if (this.ledgerId) {
      this.ledgerAccessorService.selectLedger(this.ledgerId);
    }

    this.router.navigate(
      ['/project/threads', { outlets: { primary: [this.thread.id], aside: [this.thread.id] } }],
      { queryParamsHandling: 'merge' },
    );
  }
}
