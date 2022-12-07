import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { isExported, isRedacted } from '@traent/ngx-components';
import { formatBytesSize, isNotNullOrUndefined } from '@traent/ts-utils';
import { Document } from '@viewer/models';
import { DocumentService, ProjectParticipantService, TagService, LedgerAccessorService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { downloadDocument } from '@viewer/utils';
import { filter } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-document-side-overview',
  templateUrl: './document-side-overview.component.html',
  styleUrls: ['./document-side-overview.component.scss'],
})
export class DocumentSideOverviewComponent {
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  readonly document$ = this.route.params.pipe(
    switchMap(({ id }) => this.documentService.getDocument({ id })),
    tap({ error: () => this.router.navigate(['/project']) }),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  readonly documentContent$ = this.document$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (document) => document.isContentReadable ? this.documentService.getDocumentContent({ document }) : undefined),
  );

  readonly participant$ = this.document$.pipe(
    switchMap(async (document) => !isRedacted(document.updaterId)
      ? this.projectParticipantService.getProjectParticipant({ id: document.updaterId })
      : undefined),
  );

  readonly blockAcknowledgementsInfo$ = this.document$.pipe(
    filter((document): document is Document => document !== null),
    switchMap((document) => this.ledgerAccessorService.getLedger().getAcknowledgementStatus(document.updatedInBlock.index)),
  );

  readonly documentTags$ = this.document$.pipe(
    switchMap((document) => this.tagService.getTagEntryCollection({
      page: 1,
      taggedResourceId: document.id,
    })),
    switchMap(({ items }) => Promise.all(items.map((te) => te.tagId)
      .filter(isExported)
      .map((tagId) => this.tagService.getTag({ id: tagId }))),
    ),
  );

  readonly downloadDocument = downloadDocument;
  readonly formatBytesSize = formatBytesSize;

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly tagService: TagService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

}
