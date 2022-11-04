import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, from, switchMap } from 'rxjs';

import { AcknowledgmentService } from '../../acknowledgments';
import { LedgerContextService } from '../../ledger';
import { BlockIdentification } from '../../ledger/block-table';
import { OrganizationService } from '../../organization';

export const openAcknowledgementsDialog = (dialog: MatDialog) =>
  (block: BlockIdentification) => dialog.open(AcknowledgementsDialogComponent, {
    data: block,
    maxWidth: '600px',
  });

@Component({
  selector: 'app-acknowledgments-dialog',
  templateUrl: './acknowledgements-dialog.component.html',
  styleUrls: ['./acknowledgements-dialog.component.scss'],
})
export class AcknowledgementsDialogComponent {
  readonly acks$ = from(this.acknowledgementService.getAcknowledgements(this.block.index)).pipe(
    switchMap((records: any) =>
      Promise.all(Object.entries(records).map(async ([author, ack]: [string, any]) => {
        const organizationKeyId = await this.acknowledgementService.getAuthorKeyId(author);
        return {
          author,
          ack,
          organization$: organizationKeyId
            ? this.organizationService.getOrganizationByKey(organizationKeyId)
            : of(undefined),
          block$: ack && this.ledgerContextService.getBlockIdentification(ack.blockIndex) as Promise<BlockIdentification>,
        };
      })),
    ));

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly block: BlockIdentification,
    private readonly acknowledgementService: AcknowledgmentService,
    private readonly ledgerContextService: LedgerContextService,
    private readonly organizationService: OrganizationService,
  ) {
  }
}
