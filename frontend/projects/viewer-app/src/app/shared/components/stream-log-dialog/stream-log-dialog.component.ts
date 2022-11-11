import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProjectParticipant, StreamEntry } from '@viewer/models';
import { AcknowledgementService, ProjectParticipantService, TagService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { getStreamTypeIcon } from '@viewer/utils';
import { isExported } from '@traent/ngx-components';
import { from, Observable, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-stream-log-dialog',
  templateUrl: './stream-log-dialog.component.html',
  styleUrls: ['./stream-log-dialog.component.scss'],
})
export class StreamLogDialogComponent {
  readonly editor$: Observable<ProjectParticipant | undefined> = isExported(this.stream.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant(this.stream.updaterId))
    : of(undefined);

  readonly blockAcknowledgementsInfo$ = this.acknowledgementService.getAcknowledgementStatus(this.stream.updatedInBlock.index);
  readonly streamClasses$ = from(this.tagService.getTagEntryCollection({
    page: 1,
    taggedResourceId: this.stream.id,
    blockIndex: this.stream.updatedInBlock.index,
  })).pipe(
    switchMap(({ items }) => Promise.all(items
      .map((tag) => tag.tagId)
      .filter((tagId): tagId is string => isExported(tagId))
      .map((tagId) => this.tagService.getTag(tagId, this.stream.updatedInBlock.index)),
    )),
  );

  readonly getStreamTypeIcon = getStreamTypeIcon;
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly stream: StreamEntry,
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly tagService: TagService,
  ) { }
}
