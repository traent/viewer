import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Redactable } from '@traent/ngx-components';
import { formatBytesSize } from '@traent/ts-utils';
import { LedgerAccessorService, ProjectService, StorageService } from '@viewer/services';

interface ExportInfo {
  defaultLedger?: {
    id: string;
    name?: Redactable<string>;
  };
  exportDate: string;
  exportName?: string;
  ledgersCount: number;
  size: number;
}

@Component({
  selector: 'app-export-side-info',
  templateUrl: './export-side-info.component.html',
  styleUrls: ['./export-side-info.component.scss'],
})
export class ExportSideInfoComponent {
  readonly info$: Promise<ExportInfo> = (async () => {
    const ledgers = this.storageService.getLedgers();
    const defaultLedger = this.storageService.defaultLedger;

    /**
     * IMPORTANT: this logic is necessary considering the way the `StorageService` stores
     * the information contained inside the `ledgers.json` file. The creation date
     * is passed to the single ledgers.
     *
     * This should be removed asap!
     */
    const ledger = ledgers[0];

    const [ledgerInfo, defaultLedgerProject] = await Promise.all([
      ledger.getLedgerInfo(),
      defaultLedger && this.projectService.getLedgerProject(defaultLedger.id),
    ]);

    return {
      ledgersCount: ledgers.length,
      size: this.storageService.archiveSize,
      defaultLedger: defaultLedger
        ? {
          id: defaultLedger.id,
          name: defaultLedgerProject?.name,
        } : undefined,
      exportDate: ledgerInfo.createdAt,
      exportName: this.storageService.exportName,
    };
  })();

  readonly formatBytesSize = formatBytesSize;

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly storageService: StorageService,
  ) { }

  openLedger(ledgerId: string) {
    this.ledgerAccessorService.selectLedger(ledgerId);
    this.router.navigate(['/project']);
  }
}
