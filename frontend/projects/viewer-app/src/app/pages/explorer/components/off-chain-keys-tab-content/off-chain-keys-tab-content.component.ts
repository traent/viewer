import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, shareReplay, switchMap } from 'rxjs';
import { TablePaginatorData, tableOffset } from '@traent/ngx-components';
import { StorageService } from '@viewer/services';

@Component({
  selector: 'app-off-chain-keys-tab-content',
  templateUrl: './off-chain-keys-tab-content.component.html',
  styleUrls: ['./off-chain-keys-tab-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffChainKeysTabContentComponent {
  private readonly offchainKeysPageEvent$ = new BehaviorSubject<TablePaginatorData>({
    pageIndex: 0,
    pageSize: 25,
  });
  get offchainKeysPageEvent(): TablePaginatorData {
    return this.offchainKeysPageEvent$.value;
  }
  set offchainKeysPageEvent(value: TablePaginatorData) {
    this.offchainKeysPageEvent$.next(value);
  }

  readonly offchainKeys$ = this.offchainKeysPageEvent$.pipe(
    switchMap((pageEvent) => this.storageService.getLedger().getOffchainKeys(tableOffset(pageEvent), pageEvent.pageSize)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(readonly storageService: StorageService) { }
}
