import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockIdentification } from '@viewer/models';
import { LedgerAccessorService, OrganizationService } from '@viewer/services';
import { of } from 'rxjs';

interface AcknowledgementsDialogComponentData {
  block: BlockIdentification;
  ledgerId?: string;
}

export const bindOpenAcknowledgementsDialog = (dialog: MatDialog) =>
  (block: BlockIdentification, ledgerId?: string) => dialog.open(AcknowledgementsDialogComponent, {
    data: { block, ledgerId },
    maxWidth: '600px',
  });

@Component({
  selector: 'app-acknowledgments-dialog',
  templateUrl: './acknowledgements-dialog.component.html',
  styleUrls: ['./acknowledgements-dialog.component.scss'],
})
export class AcknowledgementsDialogComponent {
  private readonly ledger = this.ledgerAccessorService.getLedger(this.data.ledgerId);
  readonly block = this.data.block;
  readonly acks$ = this.ledger.getAcknowledgements(this.data.block.index)
    .then((records) => Object.entries(records).map(([author, ack]) => {
      const organizationKeyId = this.ledger.getAuthorKeyId(author);
      return {
        author,
        ack,
        organization$: organizationKeyId
          ? this.organizationService.getOrganizationByKey(organizationKeyId)
          : of(undefined),
        block$: ack && this.ledger.getBlockLedger().getBlock(ack.blockIndex),
      };
    }));

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: AcknowledgementsDialogComponentData,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly organizationService: OrganizationService,
  ) { }
}
