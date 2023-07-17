import { Clipboard } from '@angular/cdk/clipboard';
import { Component } from '@angular/core';
import { LedgerAccessorService } from '@viewer/services';

@Component({
  selector: 'app-miscellaneous-tab-content',
  templateUrl: './miscellaneous-tab-content.component.html',
  styleUrls: ['./miscellaneous-tab-content.component.scss'],
})
export class MiscellaneousTabContentComponent {

  readonly keyPair$ = this.ledgerAccessorService.getBlockLedger().getKeyPair();
  readonly exportRequest$ = this.ledgerAccessorService.getBlockLedger().getExportRequest();


  constructor(
    private readonly clipboard: Clipboard,
    private readonly ledgerAccessorService: LedgerAccessorService,
  ) { }

  copy(v: string): void {
    this.clipboard.copy(v);
  }
}
