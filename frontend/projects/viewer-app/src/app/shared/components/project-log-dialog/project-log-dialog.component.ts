import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isRedacted } from '@traent/ngx-components';
import { BlockIdentification, Project, ProjectParticipant } from '@viewer/models';
import { LedgerAccessorService, ProjectParticipantService, WorkflowService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { getWorkflowStateLabel } from '@viewer/utils';
import { from, map, Observable, of } from 'rxjs';

interface ProjectLogDialogData {
  ledgerId?: string;
  project: Project;
}

@Component({
  selector: 'app-project-log-dialog',
  templateUrl: './project-log-dialog.component.html',
  styleUrls: ['./project-log-dialog.component.scss'],
})
export class ProjectLogDialogComponent {
  readonly ledgerId = this.data.ledgerId;
  readonly project = this.data.project;

  readonly blockAcknowledgementsInfo$ = this.ledgerAccessorService.getLedger(this.ledgerId)
    .getAcknowledgementStatus(this.project.updatedInBlock.index);

  readonly workflow$ = this.workflowService.getProjectWorkflow({
    ledgerId: this.ledgerId,
    blockIndex: this.project.updatedInBlock.index,
  });
  readonly workflowStateLabel$ = this.workflow$.then(async (workflow) => {
    const stateId = await this.workflowService.getWorkflowStateId({
      ledgerId: this.ledgerId,
      workflow,
      blockIndex: this.project.updatedInBlock.index,
    });
    return getWorkflowStateLabel(stateId, workflow?.dsl);
  });

  readonly editor$: Observable<ProjectParticipant | undefined> = !isRedacted(this.project.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant({ ledgerId: this.ledgerId, id: this.project.updaterId }))
    : of(undefined);

  readonly participants$ = from(this.projectParticipantService.getProjectParticipantCollection({
    ledgerId: this.ledgerId,
    blockIndex: this.project.updatedInBlock.index,
    page: 1,
  })).pipe(map(({ items }) => items));
  readonly organizations$ = from(this.projectParticipantService.getOrganizationCollection({
    ledgerId: this.ledgerId,
    blockIndex: this.project.updatedInBlock.index,
    page: 1,
  })).pipe(map(({ items }) => items));

  readonly openAcknowledgementsDialog = (block: BlockIdentification) =>
    bindOpenAcknowledgementsDialog(this.dialog)(block, this.ledgerId);

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: ProjectLogDialogData,
    private readonly dialog: MatDialog,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly workflowService: WorkflowService,
  ) { }
}
