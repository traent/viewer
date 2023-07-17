import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { ResourceSnapshot } from '@viewer/models';
import { LedgerAccessorService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { BehaviorSubject, combineLatest, switchMap } from 'rxjs';

@Component({
  selector: 'app-snapshot-renderer',
  templateUrl: './snapshot-renderer.component.html',
  styleUrls: ['./snapshot-renderer.component.scss'],
})
export class SnapshotRendererComponent {
  readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  }

  readonly snapshot$ = new BehaviorSubject<ResourceSnapshot | null>(null);
  @Input() set snapshot(snapshot: ResourceSnapshot | null) {
    this.snapshot$.next(snapshot);
  }

  readonly acknowledgementStatus$ =
    combineLatest([
      this.ledgerId$,
      this.snapshot$.pipe(isNotNullOrUndefined()),
    ]).pipe(switchMap(([ledgerId, snapshot]) => this.ledgerAccessorService.getLedger(ledgerId)
      .getAcknowledgementStatus(snapshot.updatedInBlock.index)));

  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly dialog: MatDialog,
  ) { }
}
