import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DocumentZoomValue,
  isExported,
  isRedacted,
  makeAcrofieldFromAnchor,
  PageRect,
  RedactedMarker,
  getPDFAcrofieldControlValue,
} from '@traent/ngx-components';
import { formatBytesSize, trackByIndex } from '@traent/ts-utils';
import { Document, DocumentContentType, StreamReference } from '@viewer/models';
import {
  DocumentService,
  getContentTypeExtension,
  StreamService,
  ProjectParticipantService,
  ProjectService,
  LedgerAccessorService,
} from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { downloadDocument, getDocumentProxy, u8ToBlob } from '@viewer/utils';
import { combineLatest, from, Observable, of } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';

const orderReferences = (references: StreamReference[]): StreamReference[] => references
  .filter((r): r is StreamReference => r.anchor)
  // Order them so we can assign an Id.
  .sort((r1, r2) => (r1.anchor.pageNumber - r2.anchor.pageNumber)
    || (r1.anchor.y - r2.anchor.y)
    || (r1.anchor.x - r2.anchor.x));

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.scss'],
})
export class DocumentContentComponent {
  readonly project$ = from(this.projectService.getLedgerProject()).pipe(
    tap({ error: () => this.router.navigate(['/project']) }),
  );

  readonly document$: Observable<Document> = this.route.params.pipe(
    switchMap(({ id }) => this.documentService.getDocument({ id })),
    tap({ error: () => this.router.navigate(['/project']) }),
  );

  readonly documentContent$ = this.document$.pipe(
    switchMap((document) => this.documentService.getDocumentContent({ document })),
    tap({ error: () => this.router.navigate(['/project']) }),
  );

  readonly documentDocumentProxy$ = combineLatest([
    this.document$,
    this.documentContent$,
  ]).pipe(
    filter(([document]) => document.uiType === DocumentContentType.PDF),
    switchMap(([, content]) => content !== undefined ? getDocumentProxy(content) : of(undefined)),
  );

  readonly defaultZoom$: Observable<DocumentZoomValue> = this.document$.pipe(
    map((content) => content.uiType === DocumentContentType.Image ? 1 : 1.25),
  );

  readonly references$ = this.document$.pipe(
    filter((document) => document.uiType === DocumentContentType.PDF),
    switchMap(({ id }) => this.streamService.getStreamReferencesCollection({
      isLocallyReferenced: true,
      documentId: id,
      page: 1,
    })),
    map(({ items }) => items),
  );

  readonly author$ = this.document$.pipe(
    map((document) => document.creatorId),
    switchMap((authorId) => authorId && !isRedacted(authorId)
      ? this.projectParticipantService.getProjectParticipant({ id: authorId })
      : of(undefined),
    ),
  );

  readonly blockAcknowledgementsInfo$ = this.document$.pipe(
    filter((document): document is Document => document !== null),
    switchMap((document) => this.ledgerAccessorService.getLedger().getAcknowledgementStatus(document.updatedInBlock.index)),
  );

  pageRects: PageRect[] = [];

  documentZoom: DocumentZoomValue = 1;
  contentLoad: 'loading' | 'loaded' | 'error' = 'loading';

  readonly DocumentContentType = DocumentContentType;
  readonly downloadDocument = downloadDocument;
  readonly formatBytesSize = formatBytesSize;
  readonly getContentTypeExtension = getContentTypeExtension;
  readonly getDocumentProxy = getDocumentProxy;
  readonly getPDFAcrofieldControlValue = getPDFAcrofieldControlValue;
  readonly makeAcrofieldFromAnchor = makeAcrofieldFromAnchor;
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);
  readonly orderReferences = orderReferences;
  readonly RedactedMarker = RedactedMarker;
  readonly trackByIndex = trackByIndex;
  readonly u8ToBlob = u8ToBlob;

  readonly getAcknowledgementStatus = (blockIndex: number) => this.ledgerAccessorService.getLedger().getAcknowledgementStatus(blockIndex);
  readonly deriveStreamEntry = async (reference: StreamReference) => isExported(reference.streamEntryId)
    ? this.streamService.getStream({ id: reference.streamEntryId })
    : undefined;

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly streamService: StreamService,
  ) { }
}
