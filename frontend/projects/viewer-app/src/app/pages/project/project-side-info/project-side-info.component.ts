import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LedgerExportKeyMode, LedgerExportResourceVersion, LedgerExportWorkflowMode } from '@viewer/models';
import {
  DocumentService,
  LedgerService,
  ProjectParticipantService,
  ProjectService,
  StorageService,
  StreamService,
  ThreadService,
  WorkflowService,
} from '@viewer/services';
import { AvatarPlaceholder, isExported } from '@traent/ngx-components';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { formatBytesSize } from '@traent/ts-utils';

import { ValidationErrorsDialogComponent } from '../validation-errors-dialog/validation-errors-dialog.component';

const getIncludedResourceVersionLabel = (config: LedgerExportResourceVersion): string =>
  config === LedgerExportResourceVersion.AllVersions
    ? 'i18n.Project.ProjectSide.exportAllVer'
    : 'i18n.Project.ProjectSide.exportLastVer';

const getWorkflowInclusionLabel = (config: LedgerExportWorkflowMode): string =>
  config === LedgerExportWorkflowMode.AllStatuses
    ? 'i18n.Project.ProjectSide.allStatusesIncl'
    : 'i18n.Project.ProjectSide.lastStatusIncl';

const getLedgerKeysLabel = (config: LedgerExportKeyMode): string => {
  switch (config) {
    case LedgerExportKeyMode.KeyPair: return 'i18n.Project.ProjectSide.keypairIncl';
    case LedgerExportKeyMode.BlockKeys: return 'i18n.Project.ProjectSide.blockKeysIncl';
    case LedgerExportKeyMode.None: return 'i18n.Common.excluded';
    default: return 'i18n.Common.unknown';
  }
};

@Component({
  selector: 'app-project-side-info',
  templateUrl: './project-side-info.component.html',
  styleUrls: ['./project-side-info.component.scss'],
})
export class ProjectSideInfoComponent {
  readonly project$ = this.projectService.getLedgerProject();
  readonly projectParticipants$ = this.projectParticipantService.getProjectParticipantCollection();
  readonly organizations$ = this.projectParticipantService.getOrganizationCollection();

  private readonly documents$ = this.documentService.getDocumentCollection();
  readonly totalDocuments$ = from(this.documents$).pipe(map((page) => page.total));
  readonly availableDocuments$ = from(this.documents$).pipe(
    map(({ items }) => items.filter((document) => isExported(document.name))),
    map((items) => items.length),
  );

  private readonly stream$ = this.streamService.getStreamCollection();
  readonly totalStreams$ = from(this.stream$).pipe(map((page) => page.total));
  readonly availableStreams$ = from(this.stream$).pipe(
    map(({ items }) => items.filter((stream) => isExported(stream.name))),
    map((items) => items.length),
  );

  private readonly threads$ = this.threadService.getThreads();
  readonly totalThreads$ = from(this.threads$).pipe(map((page) => page.total));
  readonly availableThreads$ = from(this.threads$).pipe(
    map(({ items }) => items.filter((thread) => isExported(thread.name))),
    map((items) => items.length),
  );

  readonly exportDateTime$ = this.storageService.getLedger().getLedgerInfo().then(({ createdAt }) => createdAt);
  readonly workflow$ = this.workflowService.getProjectWorkflow();
  readonly exportRequest$ = this.storageService.getLedger().getExportRequest();

  readonly AvatarPlaceholder = AvatarPlaceholder;
  readonly formatBytesSize = formatBytesSize;
  readonly getIncludedResourceVersionLabel = getIncludedResourceVersionLabel;
  readonly getLedgerKeysLabel = getLedgerKeysLabel;
  readonly getWorkflowInclusionLabel = getWorkflowInclusionLabel;

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly projectService: ProjectService,
    private readonly streamService: StreamService,
    private readonly threadService: ThreadService,
    private readonly workflowService: WorkflowService,
    readonly ledgerService: LedgerService,
    readonly storageService: StorageService,
  ) { }

  openValidationErrorsDialog(): void {
    this.dialog.open(ValidationErrorsDialogComponent, {
      data: {
        errors: this.ledgerService.problems,
        warnings: this.ledgerService.warnings,
      },
      panelClass: ['opal-w-600px'],
    });
  }
}
