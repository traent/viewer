import { ChangeDetectionStrategy, Component } from '@angular/core';
import { tableOffset, TablePaginatorData } from '@traent/ngx-components';
import { LedgerAccessorService } from '@viewer/services';
import { BehaviorSubject } from 'rxjs';
import { switchMap, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-off-chain-tab-content',
  templateUrl: './off-chain-tab-content.component.html',
  styleUrls: ['./off-chain-tab-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffChainTabContentComponent {

  readonly totalOffChainItems = this.ledgerAccessorService.getBlockLedger().getOffchainsCount();
  readonly keyPair$ = this.ledgerAccessorService.getBlockLedger().getKeyPair();

  readonly pageEvent$ = new BehaviorSubject<TablePaginatorData>({
    pageIndex: 0,
    pageSize: 25,
  });

  readonly offChainItems$ = this.pageEvent$.pipe(
    switchMap((pageEvent) => this.ledgerAccessorService.getBlockLedger().getOffchains(tableOffset(pageEvent), pageEvent.pageSize)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }
}
