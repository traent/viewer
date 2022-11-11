import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, shareReplay, switchMap } from 'rxjs';
import { TablePaginatorData, tableOffset } from '@traent/ngx-components';
import { StorageService } from '@viewer/services';

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
    switchMap((pageEvent) => this.storageService.getInchainKeys(tableOffset(pageEvent), pageEvent.pageSize)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(readonly storageService: StorageService) { }
}
