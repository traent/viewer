import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TablePaginatorData, tableOffset } from '@traent/ngx-components';
import { LedgerAccessorService } from '@viewer/services';
import { BehaviorSubject, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-in-chain-keys-tab-content',
  templateUrl: './in-chain-keys-tab-content.component.html',
  styleUrls: ['./in-chain-keys-tab-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InChainKeysTabContentComponent {
  private readonly inchainKeysPageEvent$ = new BehaviorSubject<TablePaginatorData>({
    pageIndex: 0,
    pageSize: 25,
  });
  get inchainKeysPageEvent(): TablePaginatorData {
    return this.inchainKeysPageEvent$.value;
  }
  set inchainKeysPageEvent(value: TablePaginatorData) {
    this.inchainKeysPageEvent$.next(value);
  }

  readonly inchainKeys$ = this.inchainKeysPageEvent$.pipe(
    switchMap((pageEvent) => this.ledgerAccessorService.getBlockLedger().getInchainKeys(tableOffset(pageEvent), pageEvent.pageSize)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(readonly ledgerAccessorService: LedgerAccessorService) { }
}
