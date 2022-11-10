import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BlockIdentification } from '@viewer/models';
import { AcknowledgementService, OrganizationService, StorageService } from '@viewer/services';
import { of } from 'rxjs';

export const bindOpenAcknowledgementsDialog = (dialog: MatDialog) =>
  (block: BlockIdentification) => dialog.open(AcknowledgementsDialogComponent, {
    data: block,
    maxWidth: '600px',
  });

@Component({
  selector: 'app-acknowledgments-dialog',
  templateUrl: './acknowledgements-dialog.component.html',
  styleUrls: ['./acknowledgements-dialog.component.scss'],
})
export class AcknowledgementsDialogComponent {
  readonly acks$ = this.acknowledgementService.getAcknowledgements(this.block.index)
    .then((records) => Object.entries(records).map(([author, ack]) => {
      const organizationKeyId = this.acknowledgementService.getAuthorKeyId(author);
      return {
        author,
        ack,
        organization$: organizationKeyId
          ? this.organizationService.getOrganizationByKey(organizationKeyId)
          : of(undefined),
        block$: ack && this.storageService.getBlock(ack.blockIndex),
      };
    }));

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly block: BlockIdentification,
    private readonly acknowledgementService: AcknowledgementService,
    private readonly organizationService: OrganizationService,
    private readonly storageService: StorageService,
  ) { }
}
