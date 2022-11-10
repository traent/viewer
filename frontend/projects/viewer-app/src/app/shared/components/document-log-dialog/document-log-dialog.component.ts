import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Document, ProjectParticipant } from '@viewer/models';
import { AcknowledgementService, ProjectParticipantService, TagService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { isExported, isRedacted } from '@traent/ngx-components';
import { from, Observable, of, switchMap } from 'rxjs';
import { formatBytesSize } from '@traent/ts-utils';

@Component({
  selector: 'app-document-log-dialog',
  templateUrl: './document-log-dialog.component.html',
  styleUrls: ['./document-log-dialog.component.scss'],
})
export class DocumentLogDialogComponent {
  readonly author$: Observable<ProjectParticipant | undefined> = !isRedacted(this.document.creatorId)
    ? from(this.projectParticipantService.getProjectParticipant(this.document.creatorId))
    : of(undefined);

  readonly editor$: Observable<ProjectParticipant | undefined> = !isRedacted(this.document.updaterId)
    ? from(this.projectParticipantService.getProjectParticipant(this.document.updaterId))
    : of(undefined);

  readonly blockAcknowledgementsInfo$ = this.acknowledgementService.getAcknowledgementStatus(this.document.updatedInBlock.index);
  readonly documentTags$ = from(this.tagService.getTagEntryCollection({
    page: 1,
    taggedResourceId: this.document.id,
    blockIndex: this.document.updatedInBlock.index,
  })).pipe(
    switchMap(({ items }) => Promise.all(items
      .map((tag) => tag.tagId)
      .filter((tagId): tagId is string => isExported(tagId))
      .map((tagId) => this.tagService.getTag(tagId, this.document.updatedInBlock.index)),
    )),
  );

  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);
  readonly formatBytesSize = formatBytesSize;

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly document: Document,
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly tagService: TagService,
  ) { }
}
