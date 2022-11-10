import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ResourceSnapshot } from '@viewer/models';
import { AcknowledgementService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-snapshot-renderer',
  templateUrl: './snapshot-renderer.component.html',
  styleUrls: ['./snapshot-renderer.component.scss'],
})
export class SnapshotRendererComponent {
  readonly snapshot$ = new BehaviorSubject<ResourceSnapshot | null>(null);
  @Input() set snapshot(snapshot: ResourceSnapshot | null) {
    this.snapshot$.next(snapshot);
  }

  readonly getAcknowledgementStatus = (snapshot: ResourceSnapshot | null) => snapshot
    ? this.acknowledgementService.getAcknowledgementStatus(snapshot.updatedInBlock.index)
    : null;

  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
  ) { }
}
