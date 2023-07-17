import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { isExported } from '@traent/ngx-components';
import { BlockIdentification, ProjectParticipant, StreamEntry } from '@viewer/models';
import { LedgerAccessorService, ProjectParticipantService, TagService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { getStreamTypeIcon } from '@viewer/utils';
import { from, Observable, of, switchMap } from 'rxjs';

interface StreamLogDialogData {
  ledgerId?: string;
  stream: StreamEntry;
}

@Component({
  selector: 'app-stream-log-dialog',
  templateUrl: './stream-log-dialog.component.html',
  styleUrls: ['./stream-log-dialog.component.scss'],
})
export class StreamLogDialogComponent {
  readonly ledgerId = this.data.ledgerId;
  readonly stream = this.data.stream;

  readonly editor$: Observable<ProjectParticipant | undefined> = isExported(this.stream.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant({ ledgerId: this.ledgerId, id: this.stream.updaterId }))
    : of(undefined);

  readonly blockAcknowledgementsInfo$ = this.ledgerAccessorService.getLedger(this.ledgerId)
    .getAcknowledgementStatus(this.stream.updatedInBlock.index);
  readonly streamClasses$ = from(this.tagService.getTagEntryCollection({
    page: 1,
    ledgerId: this.ledgerId,
    taggedResourceId: this.stream.id,
    blockIndex: this.stream.updatedInBlock.index,
  })).pipe(
    switchMap(({ items }) => Promise.all(items
      .map((tag) => tag.tagId)
      .filter((tagId): tagId is string => isExported(tagId))
      .map((tagId) => this.tagService.getTag({
        ledgerId: this.ledgerId,
        id: tagId,
        blockIndex: this.stream.updatedInBlock.index,
      })),
    )),
  );

  readonly getStreamTypeIcon = getStreamTypeIcon;
  readonly openAcknowledgementsDialog = (block: BlockIdentification) =>
    bindOpenAcknowledgementsDialog(this.dialog)(block, this.ledgerId);

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: StreamLogDialogData,
    private readonly dialog: MatDialog,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly tagService: TagService,
  ) { }
}
