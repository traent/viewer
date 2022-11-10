import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { isExportedAndDefined, isRedactedOrUndefined, Redactable } from '@traent/ngx-components';
import { BehaviorSubject, firstValueFrom, combineLatest } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { TagEntrySnapshot, WorkflowParticipantID } from '@viewer/models';
import { StreamService, DocumentService, TagService, ProjectParticipantService } from '@viewer/services';
import {
  getProjectParticipantId,
  getTagImage,
  getTagTypeLabel,
  redactedClass,
  redactedValue,
  snapshotContent,
  snapshotParticipantLabel,
} from '@viewer/utils';
import { TagType, TagEntryV0 } from '@ledger-objects';

import { DocumentLogDialogComponent } from '../../document-log-dialog/document-log-dialog.component';
import { StreamLogDialogComponent } from '../../stream-log-dialog/stream-log-dialog.component';

const getResourceClass = (type?: Redactable<TagType>) => {
  switch (type) {
    case TagType.Stream: return 'stream';
    case TagType.Document: return 'document';
    case TagType.Participant: return 'participant';
    default: return 'resource';
  }
};

@Component({
  selector: 'app-tag-entry-log-item',
  templateUrl: './tag-entry-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagEntryLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<TagEntrySnapshot | null>(null);
  @Input() set snapshot(value: TagEntrySnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }


  readonly itemImage$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (snapshot) => {
      const tagEntry = snapshotContent<TagEntryV0>(snapshot);
      const tag = isExportedAndDefined(tagEntry.tagId)
        ? await this.tagService.getTag(tagEntry.tagId, snapshot.updatedInBlock.index)
        : undefined;
      return getTagImage(tag?.type);
    }),
  );

  readonly projectParticipant$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (snapshot) => {
      const participantId = getProjectParticipantId(snapshot);
      return participantId
        ? await this.projectParticipantService.getProjectParticipant(participantId)
        : undefined;
    }),
    switchMap((projectParticipant) => snapshotParticipantLabel(projectParticipant)),
  );

  readonly props$ = combineLatest([
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$,
  ]).pipe(
    switchMap(async ([snapshot, member]) => {
      const tagEntry = snapshotContent<TagEntryV0>(snapshot);
      const tag = isExportedAndDefined(tagEntry.tagId)
        ? await this.tagService.getTag(tagEntry.tagId, snapshot.updatedInBlock.index)
        : undefined;

      const tagTypeLabel = getTagTypeLabel(tag?.type);
      const tagStyle = redactedClass(tag?.name);

      const resource = tag && isExportedAndDefined(tag.type) && isExportedAndDefined(tagEntry.taggedResourceId)
        ? await this.getTaggedResource(tagEntry.taggedResourceId, tag?.type, snapshot.updatedInBlock.index)
        : undefined;

      return {
        isDocumentOrStreamResource: tag && isExportedAndDefined(tag.type) && [TagType.Stream, TagType.Document].includes(tag.type),
        member,
        operation: snapshot.operation,
        resourceName: redactedValue(resource?.name),
        resourceClass: redactedClass(resource?.class),
        resourceType: getResourceClass(tag?.type),
        tag,
        tagNameValue: redactedValue(tag?.name),
        tagStyle,
        tagTypeLabel,
      };
    }),
  );

  readonly TagType = TagType;

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly streamService: StreamService,
    private readonly tagService: TagService,
  ) { }

  private async getTaggedResource(id: string, type: TagType, blockIndex: number) {
    switch (type) {
      case TagType.Stream:
        const stream = await this.streamService.getStream(id, blockIndex);
        return {
          type: 'stream',
          id: stream.id,
          name: redactedValue(stream.name),
          class: redactedClass(stream.name, 'pointer'),
          object: stream,
        };
      case TagType.Document:
        const document = await this.documentService.getDocument(id, blockIndex);
        return {
          type: 'document',
          id: document.id,
          name: redactedValue(document.name),
          class: redactedClass(document.name, 'pointer'),
          object: document,
        };
      case TagType.Participant:
        const participant = await this.projectParticipantService.getProjectParticipant(id, blockIndex)
          .then((p) => firstValueFrom(snapshotParticipantLabel(p)));
        return {
          type: 'participant',
          id: WorkflowParticipantID,
          name: redactedValue(participant.name),
          class: redactedClass(participant.class),
          object: participant,
        };
    }
  }

  async clickHandler(pointerClasses: string, snapshot: TagEntrySnapshot | null): Promise<void> {
    if (pointerClasses === 'resource' && snapshot) {
      const tagEntry = snapshotContent<TagEntryV0>(snapshot);
      if (isRedactedOrUndefined(tagEntry.taggedResourceId)) {
        return;
      }

      const tag = isExportedAndDefined(tagEntry.tagId)
        ? await this.tagService.getTag(tagEntry.tagId, snapshot.updatedInBlock.index)
        : undefined;

      if (tag && tag.type === TagType.Document) {
        const data = await this.documentService.getDocument(tagEntry.taggedResourceId, snapshot.updatedInBlock.index);
        await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, { data, panelClass: 'opal-w-600px' }).afterClosed());
      }

      if (tag && tag.type === TagType.Stream) {
        const data = await this.streamService.getStream(tagEntry.taggedResourceId, snapshot.updatedInBlock.index);
        await firstValueFrom(this.dialog.open(StreamLogDialogComponent, { data, panelClass: 'opal-w-600px' }).afterClosed());
      }
    }
  }
}


