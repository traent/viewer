import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { from, of, switchMap } from 'rxjs';

import { AcknowledgmentService } from '../../acknowledgments';
import { BlockIdentification, LedgerContextService } from '../../ledger';
import { OrganizationService } from '../../organization';

@Component({
  selector: 'app-blockchain-info-mobile',
  templateUrl: './blockchain-info-mobile.component.html',
  styleUrls: ['./blockchain-info-mobile.component.scss'],
})
export class BlockchainInfoMobileComponent {

  readonly acks$ = from(this.acknowledgementService.getAcknowledgements(this.data.block.index)).pipe(
    switchMap((records: any) => Promise.all(Object.entries(records).map(async ([author, ack]: [string, any]) => {
      const organizationKeyId = await this.acknowledgementService.getAuthorKeyId(author);
      return {
        author,
        ack,
        organization$: organizationKeyId
          ? this.organizationService.getOrganizationByKey(organizationKeyId)
          : of(undefined),
        block$: ack && this.ledgerContextService.getBlockIdentification(ack.blockIndex) as Promise<BlockIdentification>,
      };
    }))));

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) readonly data: {
      block: BlockIdentification;
    },
    private readonly acknowledgementService: AcknowledgmentService,
    private readonly ledgerContextService: LedgerContextService,
    private readonly organizationService: OrganizationService,
  ) {
  }
}
