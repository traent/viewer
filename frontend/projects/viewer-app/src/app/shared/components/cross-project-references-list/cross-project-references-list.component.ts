import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isRedacted, Redactable, RedactedMarker } from '@traent/ngx-components';
import { BlockAcknowledgementInfo, BlockItem, CrossProjectReference, Project } from '@viewer/models';
import {
  AcknowledgementService,
  CrossProjectReferenceService,
  LedgerAccessorService,
  ProjectService,
  WorkflowService,
} from '@viewer/services';
import { getWorkflowStateLabel, Ledger, parseUid } from '@viewer/utils';
import { BehaviorSubject, switchMap } from 'rxjs';

import { bindOpenAcknowledgementsDialog } from '../../dialogs/acknowledgments-dialog/acknowledgements-dialog.component';

@Component({
  selector: 'app-cross-project-references-list',
  templateUrl: './cross-project-references-list.component.html',
  styleUrls: ['./cross-project-references-list.component.scss'],
})
export class CrossProjectReferencesListComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(v: string | undefined) {
    this.ledgerId$.next(v);
  }

  readonly crossProjectReferences$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.crossProjectReferenceService.getCrossProjectReferenceCollection({ ledgerId, page: 1 })),
    switchMap(async ({ items }) => await Promise.all(items.map((reference) => this.getCrossProjectReferenceUIItem(reference)))),
  );

  @Output() readonly navigateLedger = new EventEmitter<string>();

  readonly openAcknowledgementsDialogHandler = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly acknowledgementService: AcknowledgementService,
    private readonly crossProjectReferenceService: CrossProjectReferenceService,
    private readonly projectService: ProjectService,
    private readonly workflowService: WorkflowService,
    private readonly dialog: MatDialog,
  ) { }

  private async getCrossProjectReferenceUIItem(reference: CrossProjectReference) {
    if (isRedacted(reference.targetId)) {
      return RedactedMarker;
    }

    const { ledgerId } = parseUid(reference.targetId);
    let ledger: Ledger | undefined;
    try {
      ledger = this.ledgerAccessorService.getBlockLedger(ledgerId);
    } catch { }

    let acknowledgementsInfo: BlockAcknowledgementInfo | undefined;
    let project: Project | undefined;
    let lastWorkflowState: Redactable<string> | undefined;
    let lastBlock: BlockItem | undefined;
    let lastDataBlockIndex: number | undefined;
    if (ledger) {
      [project, lastWorkflowState, lastBlock, lastDataBlockIndex] = await Promise.all([
        this.projectService.findProjectByUid(reference.targetId),
        this.getLastWorkflowState(ledgerId),
        ledger.getBlock(ledger.getBlocksCount() - 1),
        this.acknowledgementService.getContextHead(ledgerId),
      ]);

      if (lastDataBlockIndex !== undefined) {
        acknowledgementsInfo = await this.acknowledgementService.getAcknowledgementStatus(ledger.id, lastDataBlockIndex);
      }
    }
    return {
      id: reference.id,
      blockIndex: reference.updatedInBlock.index,
      inExport: !!project,
      name: project?.name,
      updatedAt: lastBlock?.createdAt,
      ledgerId,
      lastWorkflowState,
      ackInfo: acknowledgementsInfo?.status,
      openAckDialog: () => lastBlock && ledger && bindOpenAcknowledgementsDialog(this.dialog)(lastBlock, ledger.id),
    };
  }

  private async getLastWorkflowState(ledgerId: string) {
    let workflowState: Redactable<string> | undefined;
    try {
      const workflow = await this.workflowService.getProjectWorkflow({ ledgerId });
      const workflowStateId = await this.workflowService.getWorkflowStateId({ workflow, ledgerId });
      workflowState = getWorkflowStateLabel(workflowStateId, workflow?.dsl);
    } catch { }
    return workflowState;
  }
}
