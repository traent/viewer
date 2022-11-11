import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Document } from '@viewer/models';
import { DocumentService, ProjectParticipantService, AcknowledgementService, TagService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { downloadDocument } from '@viewer/utils';
import { isRedacted } from '@traent/ngx-components';
import { of, filter, combineLatest } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { formatBytesSize } from '@traent/ts-utils';

@Component({
  selector: 'app-document-side-overview',
  templateUrl: './document-side-overview.component.html',
  styleUrls: ['./document-side-overview.component.scss'],
})
export class DocumentSideOverviewComponent {
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  readonly document$ = this.route.params.pipe(
    switchMap((params) => this.documentService.getDocument(params.id)),
    tap({ error: () => this.router.navigate(['/project']) }),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  readonly participant$ = this.document$.pipe(
    switchMap(async (document) => !isRedacted(document.updaterId)
      ? this.projectParticipantService.getProjectParticipant(document.updaterId)
      : undefined),
  );

  readonly blockAcknowledgementsInfo$ = this.document$.pipe(
    filter((document): document is Document => document !== null),
    switchMap((document) => this.acknowledgementService.getAcknowledgementStatus(document.updatedInBlock.index)),
  );

  readonly documentTags$ = this.document$.pipe(
    switchMap((document) => this.tagService.getTagEntryCollection({
      page: 1,
      taggedResourceId: document.id,
    })),
    switchMap(({ items }) => items.length > 0 ? combineLatest(items.map((tagEntry) => tagEntry.tag())) : of([])),
  );

  readonly downloadDocument = downloadDocument;
  readonly formatBytesSize = formatBytesSize;

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly tagService: TagService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

}
