import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Project, ProjectParticipant } from '@viewer/models';
import { AcknowledgementService, ProjectParticipantService, WorkflowService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { isRedacted } from '@traent/ngx-components';
import { from, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-project-log-dialog',
  templateUrl: './project-log-dialog.component.html',
  styleUrls: ['./project-log-dialog.component.scss'],
})
export class ProjectLogDialogComponent {
  readonly blockAcknowledgementsInfo$ = this.acknowledgementService.getAcknowledgementStatus(this.project.updatedInBlock.index);
  readonly workflow$ = this.workflowService.getProjectWorkflow(this.project.updatedInBlock.index);

  readonly editor$: Observable<ProjectParticipant | undefined> = !isRedacted(this.project.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant(this.project.updaterId))
    : of(undefined);

  readonly participants$ = from(this.projectParticipantService.getProjectParticipantCollection({
    blockIndex: this.project.updatedInBlock.index,
    page: 1,
  })).pipe(map(({ items }) => items));
  readonly organizations$ = from(this.projectParticipantService.getOrganizationCollection({
    blockIndex: this.project.updatedInBlock.index,
    page: 1,
  })).pipe(map(({ items }) => items));

  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly project: Project,
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly workflowService: WorkflowService,
  ) { }
}
