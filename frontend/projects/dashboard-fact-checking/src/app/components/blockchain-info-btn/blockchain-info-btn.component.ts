import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { BlockAcknowledgementInfo } from '../../acknowledgments';
import { BlockIdentification } from '../../ledger';
import { openAcknowledgementsDialog } from '../acknowledgments-dialog/acknowledgements-dialog.component';

@Component({
  selector: 'app-blockchain-info-btn',
  template: `
    <button
      *ngIf="block"
      mat-stroked-button
      class="opal-radius-20 opal-bg-grey-100"
      (click)="openAcknowledgementsDialogHandler(block)">
      <span>{{ 'Blockchain Info' | translate }}</span>
      <!-- <app-acks-icon></app-acks-icon> -->
    </button>
  `,
})
export class BlockchainInfoBtnComponent {

  @Input() block?: BlockIdentification;
  @Input() blockAcknowledgementInfo: BlockAcknowledgementInfo | null = null;

  readonly openAcknowledgementsDialogHandler = openAcknowledgementsDialog(this.dialog);

  constructor(
    private readonly dialog: MatDialog,
  ) {
  }
}
