import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { pageEventDistinct, Redactable } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import { AcknowledgementStatus } from '@viewer/models';
import { AcknowledgementService, LedgerAccessorService, ProjectService, StorageService } from '@viewer/services';
import { AcknowledgementsDialogComponent, bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { collectionToPage } from '@viewer/utils';
import { BehaviorSubject, map, Observable, switchMap } from 'rxjs';

interface TableItem {
  id: string;
  address: string;
  projectName?: Redactable<string>;
  createdAt?: string;
  updatedAt?: string;
  ackInfo$: Promise<AcknowledgementStatus>;
  openAckDialog: () => MatDialogRef<AcknowledgementsDialogComponent, void>;
}

@Component({
  selector: 'app-ledger-switch-page',
  templateUrl: './ledger-switch-page.component.html',
  styleUrls: ['./ledger-switch-page.component.scss'],
})
export class LedgerSwitchPageComponent {
  readonly pageEvent$ = new BehaviorSubject({ pageIndex: 0, pageSize: 25 });
  get pageEvent() {
    return this.pageEvent$.value;
  }

  readonly ledgers$: Observable<Page<TableItem>> = this.pageEvent$.pipe(
    pageEventDistinct(),
    map(({ pageIndex, pageSize }) => collectionToPage(this.storageService.getLedgers(), pageIndex + 1, pageSize)),
    switchMap(async (page) => {
      const items = await Promise.all(page.items.map(async (ledger) => {
        const [ledgerInfo, project, firstBlock, lastBlock] = await Promise.all([
          ledger.getLedgerInfo(),
          this.projectService.getLedgerProject(ledger.id),
          ledger.getBlock(0),
          ledger.getBlock(ledger.getBlocksCount() - 1),
        ]);
        const acknowledgementsInfo = this.acknowledgementService.getAcknowledgementStatus(ledger.id, lastBlock.index);

        return {
          id: ledger.id,
          projectName: project?.name,
          address: ledgerInfo.address,
          createdAt: firstBlock.createdAt,
          updatedAt: lastBlock.createdAt,
          ackInfo$: acknowledgementsInfo.then(({ status }) => status),
          openAckDialog: () => bindOpenAcknowledgementsDialog(this.dialog)(lastBlock, ledger.id),
        };
      }));

      return { ...page, items };
    }),
  );

  readonly exportName = this.storageService.exportName;

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly storageService: StorageService,
  ) { }

  openLedger(ledgerId: string) {
    this.ledgerAccessorService.selectLedger(ledgerId);
    this.router.navigate(['/project']);
  }

  selectLedger(ledgerId: string) {
    this.router.navigate([ledgerId, 'info'], { relativeTo: this.route });
  }
}
