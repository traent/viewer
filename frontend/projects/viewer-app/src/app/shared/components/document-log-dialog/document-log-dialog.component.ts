import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { isExported, isRedacted } from '@traent/ngx-components';
import { formatBytesSize } from '@traent/ts-utils';
import { BlockIdentification, Document, ProjectParticipant } from '@viewer/models';
import { LedgerAccessorService, ProjectParticipantService, TagService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { from, Observable, of, switchMap } from 'rxjs';

interface DocumentLogDialogData {
  ledgerId?: string;
  document: Document;
}

@Component({
  selector: 'app-document-log-dialog',
  templateUrl: './document-log-dialog.component.html',
  styleUrls: ['./document-log-dialog.component.scss'],
})
export class DocumentLogDialogComponent {
  readonly ledgerId = this.data.ledgerId;
  readonly document = this.data.document;

  readonly author$: Observable<ProjectParticipant | undefined> = !isRedacted(this.document.creatorId)
    ? from(this.projectParticipantService.getProjectParticipant({ ledgerId: this.ledgerId, id: this.document.creatorId }))
    : of(undefined);

  readonly editor$: Observable<ProjectParticipant | undefined> = !isRedacted(this.document.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant({ ledgerId: this.ledgerId, id: this.document.updaterId }))
    : of(undefined);

  readonly blockAcknowledgementsInfo$ = this.ledgerAccessorService.getLedger(this.ledgerId)
    .getAcknowledgementStatus(this.document.updatedInBlock.index);
  readonly documentTags$ = from(this.tagService.getTagEntryCollection({
    page: 1,
    ledgerId: this.ledgerId,
    taggedResourceId: this.document.id,
    blockIndex: this.document.updatedInBlock.index,
  })).pipe(
    switchMap(({ items }) => Promise.all(items
      .map((tag) => tag.tagId)
      .filter((tagId): tagId is string => isExported(tagId))
      .map((tagId) => this.tagService.getTag({
        ledgerId: this.ledgerId,
        id: tagId,
        blockIndex: this.document.updatedInBlock.index,
      })),
    )),
  );

  readonly openAcknowledgementsDialog = (block: BlockIdentification) =>
    bindOpenAcknowledgementsDialog(this.dialog)(block, this.ledgerId);
  readonly formatBytesSize = formatBytesSize;

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: DocumentLogDialogData,
    private readonly dialog: MatDialog,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly router: Router,
    private readonly tagService: TagService,
  ) { }

  navigateDocument() {
    if (this.ledgerId) {
      this.ledgerAccessorService.selectLedger(this.ledgerId);
    }

    this.router.navigate(
      ['/project/documents/', { outlets: { primary: [this.document.id, 'versions'], aside: null } }],
      {
        queryParams: isExported(this.document.version) ? { vMain: this.document.version } : null,
        queryParamsHandling: 'merge',
      },
    );
  }
}
