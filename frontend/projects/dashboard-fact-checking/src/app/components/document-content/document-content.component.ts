import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { PageRect } from '@traent/ngx-components';
import { shareReplay, switchMap } from 'rxjs';
import { isNotNullOrUndefined } from '@traent/ts-utils';

import { AcknowledgmentService } from '../../acknowledgments';
import { Document, DocumentContentType, DocumentsService, downloadDocument, UiDocumentsService } from '../../documents';
import { getDocumentProxyFromUrl } from '../../file';
import { DocumentZoomValue } from '../../pdf-viewer/viewer-toolbar/viewer-toolbar.component';
import { openAcknowledgementsDialog } from '../acknowledgments-dialog/acknowledgements-dialog.component';
import { DocumentActionsMobileComponent } from '../document-actions-mobile/document-actions-mobile.component';

@Component({
  selector: 'app-document-content',
  templateUrl: './document-content.component.html',
  styleUrls: ['./document-content.component.scss'],
})
export class DocumentContentComponent {

  readonly document$ = this.route.params.pipe(
    switchMap(({ id }) => this.documentsService.getDocumentOrDefault(id)),
    shareReplay({ refCount: true, bufferSize: 1 }),
  );

  readonly documentDocumentProxy$ = this.document$.pipe(
    isNotNullOrUndefined(),
    switchMap((doc) => doc?.getDataUrl()),
    isNotNullOrUndefined(),
    switchMap((url) => getDocumentProxyFromUrl(url)),
  );

  readonly ackInfo$ = this.document$.pipe(
    isNotNullOrUndefined(),
    switchMap((document) => this.acknowledgementService.getAcknowledgementStatus(document.updatedInBlock.index)),
  );

  readonly DocumentContentType = DocumentContentType;

  readonly openAcknowledgementsDialogHandler = openAcknowledgementsDialog(this.dialog);

  isDocumentContentLoad = false;
  isDocumentListMobileShown = false;

  // PDF Viewer
  documentZoom: DocumentZoomValue = 1;
  pageRects: PageRect[] = [];

  constructor(
    private readonly acknowledgementService: AcknowledgmentService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly dialog: MatDialog,
    private readonly documentsService: DocumentsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly uiDocumentsService: UiDocumentsService,
  ) {
  }

  toggleDocumentsMobileHandler() {
    this.isDocumentListMobileShown = !this.isDocumentListMobileShown;
  }

  showDocumentActionsHandler(document: Document) {
    this.bottomSheet.open(DocumentActionsMobileComponent, { data: { document }});
  }

  // eslint-disable-next-line class-methods-use-this
  downloadDocumentHandler(document: Document) {
    return downloadDocument(document);
  }

  shareDocumentHandler() {
    this.uiDocumentsService.shareDocument();
  }

  changeDocumentContentHandler(document: { id: string}) {
    this.isDocumentListMobileShown = false;
    return this.router.navigate(['/documents', document.id], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }
}
