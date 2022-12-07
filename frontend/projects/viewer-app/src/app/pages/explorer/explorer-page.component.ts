import { Component } from '@angular/core';
import { LedgerAccessorService, LedgerService } from '@viewer/services';
import { BehaviorSubject } from 'rxjs';

type TagLabel = 'block' | 'off chain data' | 'proofs' | 'in chain keys' | 'off chain keys' | 'miscellaneous';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer-page.component.html',
  styleUrls: ['./explorer-page.component.scss'],
})
export class ExplorerPageComponent {

  readonly ledgerInfo$ = this.ledgerAccessorService.getBlockLedger().getLedgerInfo();

  readonly tagLabel$ = new BehaviorSubject<TagLabel>('block');
  get tagLabel(): TagLabel {
    return this.tagLabel$.value;
  }
  set tagLabel(value: TagLabel) {
    this.tagLabel$.next(value);
  }

  constructor(
    readonly ledgerAccessorService: LedgerAccessorService,
    readonly ledgerService: LedgerService,
  ) { }
}
