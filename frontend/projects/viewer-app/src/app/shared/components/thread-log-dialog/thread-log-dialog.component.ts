import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Thread } from '@viewer/models';
import { AcknowledgementService, ProjectParticipantService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { isExported, isExportedAndDefined } from '@traent/ngx-components';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-thread-log-dialog',
  templateUrl: './thread-log-dialog.component.html',
  styleUrls: ['./thread-log-dialog.component.scss'],
})
export class ThreadLogDialogComponent {
  readonly editor$ =
    isExported(this.thread.updaterId)
      ? from(this.projectParticipantService.getProjectParticipant(this.thread.updaterId))
      : of(undefined);

  readonly assignee$ =
    isExportedAndDefined(this.thread.assigneeId) && this.thread.assigneeId !== null
      ? from(this.projectParticipantService.getProjectParticipant(this.thread.assigneeId))
      : of(undefined);

  readonly blockAcknowledgementsInfo$ = this.acknowledgementService.getAcknowledgementStatus(this.thread.updatedInBlock.index);

  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly thread: Thread,
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
  ) { }
}
