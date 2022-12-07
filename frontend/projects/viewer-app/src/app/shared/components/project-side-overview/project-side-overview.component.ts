import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ViewerAgentType } from '@api/models';
import { AvatarPlaceholder, isExported } from '@traent/ngx-components';
import { formatBytesSize } from '@traent/ts-utils';
import { LedgerExportKeyMode, LedgerExportResourceVersion, LedgerExportWorkflowMode } from '@viewer/models';
import {
  CrossProjectReferenceService,
  DocumentService,
  LedgerAccessorService,
  LedgerService,
  ProjectParticipantService,
  ProjectService,
  StreamService,
  ThreadService,
  WorkflowService,
} from '@viewer/services';
import { ValidationErrorsDialogComponent } from '@viewer/shared';
import { getWorkflowStateLabel } from '@viewer/utils';
import { BehaviorSubject, combineLatest, map, switchMap } from 'rxjs';

import { getThingTypeInfo } from '../../../core/models/ui-things';

const getIncludedResourceVersionLabel = (config: LedgerExportResourceVersion): string =>
  config === LedgerExportResourceVersion.AllVersions
    ? 'i18n.ProjectSideOverview.exportAllVer'
    : 'i18n.ProjectSideOverview.exportLastVer';

const getWorkflowInclusionLabel = (config: LedgerExportWorkflowMode): string =>
  config === LedgerExportWorkflowMode.AllStatuses
    ? 'i18n.ProjectSideOverview.allStatusesIncl'
    : 'i18n.ProjectSideOverview.lastStatusIncl';

const getLedgerKeysLabel = (config: LedgerExportKeyMode): string => {
  switch (config) {
    case LedgerExportKeyMode.KeyPair: return 'i18n.ProjectSideOverview.keypairIncl';
    case LedgerExportKeyMode.BlockKeys: return 'i18n.ProjectSideOverview.blockKeysIncl';
    case LedgerExportKeyMode.None: return 'i18n.Common.excluded';
    default: return 'i18n.Common.unknown';
  }
};

@Component({
  selector: 'app-project-side-overview',
  templateUrl: './project-side-overview.component.html',
  styleUrls: ['./project-side-overview.component.scss'],
})
export class ProjectSideOverviewComponent {
  readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  get ledgerId() {
    return this.ledgerId$.value;
  }
  @Input() set ledgerId(v: string | undefined) {
    this.ledgerId$.next(v);
  }

  readonly createdAt$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.ledgerAccessorService.getBlockLedger(ledgerId).getBlock(0)),
    map((block) => block.createdAt),
  );
  readonly lastEditAt$ = this.ledgerId$.pipe(
    map((ledgerId) => this.ledgerAccessorService.getBlockLedger(ledgerId)),
    switchMap((ledger) => ledger.getBlock(ledger.getBlocksCount() - 1)),
    map((block) => block.createdAt),
  );

  readonly project$ = this.ledgerId$.pipe(switchMap((ledgerId) => this.projectService.getLedgerProject(ledgerId)));
  readonly projectParticipants$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.projectParticipantService.getProjectParticipantCollection({ ledgerId, page: 1 })),
  );
  readonly organizations$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.projectParticipantService.getOrganizationCollection({ ledgerId, page: 1 })),
  );

  readonly totalCrossProjectReferences$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.crossProjectReferenceService.getCrossProjectReferenceCollection({ ledgerId, page: 1 })),
    map(({ items }) => items.length),
  );

  private readonly documents$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.documentService.getDocumentCollection({ ledgerId, page: 1 })),
  );
  readonly totalDocuments$ = this.documents$.pipe(map((page) => page.total));
  readonly availableDocuments$ = this.documents$.pipe(
    map(({ items }) => items.filter((document) => isExported(document.name))),
    map((items) => items.length),
  );

  private readonly stream$ = this.ledgerId$.pipe(switchMap((ledgerId) => this.streamService.getStreamCollection({ ledgerId, page: 1 })));
  readonly totalStreams$ = this.stream$.pipe(map((page) => page.total));
  readonly availableStreams$ = this.stream$.pipe(
    map(({ items }) => items.filter((stream) => isExported(stream.name))),
    map((items) => items.length),
  );

  private readonly threads$ = this.ledgerId$.pipe(switchMap((ledgerId) => this.threadService.getThreads({ ledgerId, page: 1 })));
  readonly totalThreads$ = this.threads$.pipe(map((page) => page.total));
  readonly availableThreads$ = this.threads$.pipe(
    map(({ items }) => items.filter((thread) => isExported(thread.name))),
    map((items) => items.length),
  );

  readonly exportDateTime$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.ledgerAccessorService.getBlockLedger(ledgerId).getLedgerInfo()),
    map(({ createdAt }) => createdAt),
  );
  readonly exportRequest$ = this.ledgerId$.pipe(
    switchMap((ledgerId) => this.ledgerAccessorService.getBlockLedger(ledgerId).getExportRequest()),
  );

  readonly workflow$ = this.ledgerId$.pipe(switchMap((ledgerId) => this.workflowService.getProjectWorkflow({ ledgerId })));
  readonly workflowStateLabel$ = combineLatest([
    this.ledgerId$,
    this.workflow$,
  ]).pipe(
    switchMap(async ([ledgerId, workflow]) => {
      const stateId = await this.workflowService.getWorkflowStateId({ workflow, ledgerId });
      return getWorkflowStateLabel(stateId, workflow?.dsl);
    }),
  );

  readonly archiveSize$ = this.ledgerId$.pipe(map((ledgerId) => this.ledgerAccessorService.getBlockLedger(ledgerId).archiveSize));

  @Output() readonly navigateOrganizations = new EventEmitter<void>();
  @Output() readonly navigateExplorer = new EventEmitter<void>();
  @Output() readonly navigateParticipants = new EventEmitter<void>();
  @Output() readonly navigateCrossProjectReferences = new EventEmitter<void>();

  readonly AvatarPlaceholder = AvatarPlaceholder;
  readonly formatBytesSize = formatBytesSize;
  readonly getIncludedResourceVersionLabel = getIncludedResourceVersionLabel;
  readonly getLedgerKeysLabel = getLedgerKeysLabel;
  readonly getThingTypeInfo = getThingTypeInfo;
  readonly getWorkflowInclusionLabel = getWorkflowInclusionLabel;
  readonly ViewerAgentType = ViewerAgentType;

  constructor(
    private readonly crossProjectReferenceService: CrossProjectReferenceService,
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly projectService: ProjectService,
    private readonly streamService: StreamService,
    private readonly threadService: ThreadService,
    private readonly workflowService: WorkflowService,
    readonly ledgerService: LedgerService,
  ) { }

  openValidationErrorsDialog(ledgerId?: string | null): void {
    if (ledgerId === null) {
      return;
    }

    ledgerId = ledgerId ?? this.ledgerAccessorService.selectedLedgerId;
    if (!ledgerId) {
      throw new Error(`Impossible to find validation errors without specifying a valid ledgerId`);
    }

    const { problems, warnings } = this.ledgerService.validationState[ledgerId];
    this.dialog.open(ValidationErrorsDialogComponent, {
      data: {
        errors: problems,
        warnings,
      },
      panelClass: ['tw-w-[600px]'],
    });
  }
}
