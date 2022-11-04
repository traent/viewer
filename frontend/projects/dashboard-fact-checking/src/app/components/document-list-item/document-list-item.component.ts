import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { BlockAcknowledgementInfo } from '../../acknowledgments';
import { Document, downloadDocument } from '../../documents';
import { getLabelColorFromHex, Tag } from '../../tags';
import { openAcknowledgementsDialog } from '../acknowledgments-dialog/acknowledgements-dialog.component';
import { DocumentActionsMobileComponent } from '../document-actions-mobile/document-actions-mobile.component';

interface InternalDocument {
  data: Document;
  tags$: Observable<(Tag | undefined)[]>;
  ackInfo$: Observable<BlockAcknowledgementInfo>;
};

@Component({
  selector: 'app-document-list-item',
  templateUrl: './document-list-item.component.html',
  styleUrls: ['./document-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentListItemComponent {

  @Input() document?: InternalDocument;

  readonly openAcknowledgementsDialogHandler = openAcknowledgementsDialog(this.dialog);
  readonly getLabelColorFromHex = getLabelColorFromHex;

  constructor(
    private readonly bottomSheet: MatBottomSheet,
    private readonly dialog: MatDialog,
  ) {
  }

  async downloadDocumentHandler() {
    if (this.document) {
      await downloadDocument(this.document.data);
    }
  }

  showDocumentActionsHandler() {
    this.bottomSheet.open(DocumentActionsMobileComponent, { data: { document: this.document?.data }});
  }
}
