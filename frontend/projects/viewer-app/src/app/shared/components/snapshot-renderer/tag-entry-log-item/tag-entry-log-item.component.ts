import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TagType, TagEntryV0 } from '@ledger-objects';
import { isExportedAndDefined, isRedactedOrUndefined, Redactable } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { TagEntrySnapshot, WorkflowParticipantID } from '@viewer/models';
import { StreamService, DocumentService, TagService, ProjectParticipantService } from '@viewer/services';
import {
  getProjectParticipantId,
  getTagImage,
  getTagTypeLabel,
  redactedClass,
  redactedValue,
  ResourceParams,
  snapshotContent,
  snapshotParticipantLabel,
} from '@viewer/utils';
import { BehaviorSubject, firstValueFrom, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

  readonly snapshot$ = new BehaviorSubject<TagEntrySnapshot | null>(null);
  @Input() set snapshot(value: TagEntrySnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(async ([ledgerId, snapshot]) => {
      const tagEntry = snapshotContent<TagEntryV0>(snapshot);
      const tag = isExportedAndDefined(tagEntry.tagId)
        ? await this.tagService.getTag({ ledgerId, id: tagEntry.tagId, blockIndex: snapshot.updatedInBlock.index })
        : undefined;
      return getTagImage(tag?.type);
    }),
  );

  private readonly projectParticipant$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(async ([ledgerId, snapshot]) => {
      const participantId = getProjectParticipantId(snapshot);
      return participantId
        ? await this.projectParticipantService.getProjectParticipant({ ledgerId, id: participantId })
        : undefined;
    }),
    switchMap(snapshotParticipantLabel),
  );

  readonly props$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$,
  ]).pipe(
    switchMap(async ([ledgerId, snapshot, member]) => {
      const tagEntry = snapshotContent<TagEntryV0>(snapshot);
      const tag = isExportedAndDefined(tagEntry.tagId)
        ? await this.tagService.getTag({ ledgerId, id: tagEntry.tagId, blockIndex: snapshot.updatedInBlock.index })
        : undefined;

      const tagTypeLabel = getTagTypeLabel(tag?.type);
      const tagStyle = redactedClass(tag?.name);

      const resource = tag && isExportedAndDefined(tag.type) && isExportedAndDefined(tagEntry.taggedResourceId)
        ? await this.getTaggedResource(tag?.type, { ledgerId, id: tagEntry.taggedResourceId, blockIndex: snapshot.updatedInBlock.index })
        : undefined;

      return {
        isDocumentOrStreamResource: tag && isExportedAndDefined(tag.type) && [TagType.Stream, TagType.Document].includes(tag.type),
        member,
        operation: snapshot.operation,
        resourceName: redactedValue(resource?.name),
        resourceClass: resource?.class ?? 'redacted',
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

  private async getTaggedResource(type: TagType, params: ResourceParams) {
    switch (type) {
      case TagType.Stream:
        const stream = await this.streamService.getStream(params);
        return {
          type: 'stream',
          id: stream.id,
          name: redactedValue(stream.name),
          class: redactedClass(stream.name, 'pointer'),
          object: stream,
        };
      case TagType.Document:
        const document = await this.documentService.getDocument(params);
        return {
          type: 'document',
          id: document.id,
          name: redactedValue(document.name),
          class: redactedClass(document.name, 'pointer'),
          object: document,
        };
      case TagType.Participant:
        const participant = await this.projectParticipantService.getProjectParticipant(params)
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

  async clickHandler(pointerClasses: string, snapshot: TagEntrySnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'resource' && snapshot) {
      const tagEntry = snapshotContent<TagEntryV0>(snapshot);
      if (isRedactedOrUndefined(tagEntry.taggedResourceId)) {
        return;
      }

      const resourceParams = { ledgerId, id: tagEntry.taggedResourceId, blockIndex: snapshot.updatedInBlock.index };
      const tag = isExportedAndDefined(tagEntry.tagId)
        ? await this.tagService.getTag({ ledgerId, id: tagEntry.tagId, blockIndex: snapshot.updatedInBlock.index })
        : undefined;

      if (tag && tag.type === TagType.Document) {
        const document = await this.documentService.getDocument(resourceParams);
        await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, {
          data: { ledgerId, document },
          panelClass: 'tw-w-[600px]',
        }).afterClosed());
      }

      if (tag && tag.type === TagType.Stream) {
        const stream = await this.streamService.getStream(resourceParams);
        await firstValueFrom(this.dialog.open(StreamLogDialogComponent, {
          data: { ledgerId, stream },
          panelClass: 'tw-w-[600px]',
        }).afterClosed());
      }
    }
  }
}


