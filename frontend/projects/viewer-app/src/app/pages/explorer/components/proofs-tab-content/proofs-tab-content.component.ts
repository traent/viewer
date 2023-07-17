import { Component } from '@angular/core';
import { LedgerAccessorService } from '@viewer/services';

@Component({
  selector: 'app-proofs-tab-content',
  templateUrl: './proofs-tab-content.component.html',
  styleUrls: ['./proofs-tab-content.component.scss'],
})
export class ProofsTabContentComponent {

  readonly notaryItems = this.ledgerAccessorService.getBlockLedger().getNotaryProofs();

  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }
}
