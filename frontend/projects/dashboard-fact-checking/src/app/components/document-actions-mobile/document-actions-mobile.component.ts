import { Component, Inject } from '@angular/core';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

import { Document, downloadDocument } from '../../documents';
import { BlockchainInfoMobileComponent } from '../blockchain-info-mobile/blockchain-info-mobile.component';
import { DocumentDetailsMobileComponent } from '../document-details-mobile/document-details-mobile.component';

@Component({
  selector: 'app-document-actions-mobile',
  templateUrl: './document-actions-mobile.component.html',
  styleUrls: ['./document-actions-mobile.component.scss'],
})
export class DocumentActionsMobileComponent {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) private readonly data: {
      document: Document;
    },
    private readonly bottomSheet: MatBottomSheet,
    private readonly bottomSheetRef: MatBottomSheetRef<DocumentActionsMobileComponent>,
  ) {
  }

  showBlockchainInfoHandler() {
    this.bottomSheetRef.dismiss();
    this.bottomSheet.open(BlockchainInfoMobileComponent, {
      data: {
        block: this.data?.document.updatedInBlock,
      },
      panelClass: 'no-bottom-sheet-padding',
    });
  }

  showDocumentDetailsHandler() {
    this.bottomSheetRef.dismiss();
    this.bottomSheet.open(DocumentDetailsMobileComponent, {
      data: {
        document: this.data?.document,
      },
      panelClass: 'no-bottom-sheet-padding',
    });
  }

  downloadDocumentHandler() {
    return downloadDocument(this.data.document);
  }
}
