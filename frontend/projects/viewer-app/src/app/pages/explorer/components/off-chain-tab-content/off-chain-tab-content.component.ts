import { ChangeDetectionStrategy, Component } from '@angular/core';
import { StorageService } from '@viewer/services';
import { BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';
import { tableOffset, TablePaginatorData } from '@traent/ngx-components';

@Component({
  selector: 'app-off-chain-tab-content',
  templateUrl: './off-chain-tab-content.component.html',
  styleUrls: ['./off-chain-tab-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffChainTabContentComponent {

  readonly totalOffChainItems = this.storageService.getLedger().getOffchainsCount();
  readonly keyPair$ = this.storageService.getLedger().getKeyPair();

  readonly pageEvent$ = new BehaviorSubject<TablePaginatorData>({
    pageIndex: 0,
    pageSize: 25,
  });

  readonly offChainItems$ = this.pageEvent$.pipe(
    switchMap((pageEvent) => this.storageService.getLedger().getOffchains(tableOffset(pageEvent), pageEvent.pageSize)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(
    private readonly storageService: StorageService,
  ) { }
}
