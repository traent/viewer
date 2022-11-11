import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LedgerService, StorageService } from '@viewer/services';
import { BehaviorSubject } from 'rxjs';

type TagLabel = 'block' | 'off chain data' | 'proofs' | 'in chain keys' | 'off chain keys' | 'miscellaneous';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer-page.component.html',
  styleUrls: ['./explorer-page.component.scss'],
})
export class ExplorerPageComponent {

  readonly ledgerInfo$ = this.storageService.getLedger().getLedgerInfo();

  readonly tagLabel$ = new BehaviorSubject<TagLabel>('block');
  get tagLabel(): TagLabel {
    return this.tagLabel$.value;
  }
  set tagLabel(value: TagLabel) {
    this.tagLabel$.next(value);
  }

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
    readonly ledgerService: LedgerService,
  ) { }

  async closeLedger(): Promise<void> {
    this.ledgerService.reset();
    this.router.navigate(['/']);
  }
}
