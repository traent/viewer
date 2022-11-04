import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { isRedacted } from '@traent/ngx-components';
import { combineLatest, filter, map, of, switchMap } from 'rxjs';
import { formatBytesSize, isNotNullOrUndefined } from '@traent/ts-utils';

import { AcknowledgmentService } from '../../acknowledgments';
import { Document, DocumentsService, downloadDocument } from '../../documents';
import { ParticipantsService } from '../../participants';
import { LedgerProjectParticipant, WorkflowParticipant } from '../../participants/participant';
import { TagsService } from '../../tags';
import { openAcknowledgementsDialog } from '../acknowledgments-dialog/acknowledgements-dialog.component';

@Component({
  selector: 'app-document-details',
  templateUrl: './document-details.component.html',
  styleUrls: ['./document-details.component.scss'],
})
export class DocumentDetailsComponent {

  private readonly documentId$ = this.route.queryParams.pipe(
    map(({ docDetails }) => docDetails),
  );

  readonly document$ = this.documentId$.pipe(
    switchMap((id) => this.documentsService.getDocument(id)),
  );

  readonly participant$ = this.document$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (document) => !isRedacted(document.updaterId)
      ? this.participantsService.getParticipant(document.updaterId)
      : undefined,
    ),
    filter((i): i is LedgerProjectParticipant => typeof i !== typeof WorkflowParticipant),
  );

  readonly documentTags$ = this.document$.pipe(
    isNotNullOrUndefined(),
    switchMap((document) => this.tagsService.getTagEntries({
      taggedResourceId: document.id,
    })),
    switchMap((items) => items.length > 0
      ? combineLatest(items.map((tagEntry) => tagEntry.tag()))
      : of([]),
    ),
  );

  readonly blockAcknowledgementsInfo$ = this.document$.pipe(
    filter((document): document is Document => !!document),
    switchMap((document) => this.acknowledgementService.getAcknowledgementStatus(document.updatedInBlock.index)),
  );

  readonly formatBytesSize = formatBytesSize;
  readonly openAcknowledgementsDialog = openAcknowledgementsDialog(this.dialog);

  constructor(
    private readonly acknowledgementService: AcknowledgmentService,
    private readonly dialog: MatDialog,
    private readonly documentsService: DocumentsService,
    private readonly participantsService: ParticipantsService,
    private readonly route: ActivatedRoute,
    private readonly tagsService: TagsService,
    readonly router: Router,
  ) {
  }

  // eslint-disable-next-line class-methods-use-this
  async downloadDocumentHandler(document: Document) {
    await downloadDocument(document);
  }

  backToListHandler() {
    return this.router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: { docDetails: undefined },
      relativeTo: this.route,
    });
  }
}
