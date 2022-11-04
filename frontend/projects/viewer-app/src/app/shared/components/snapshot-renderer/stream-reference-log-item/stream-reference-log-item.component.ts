import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { isExportedAndDefined } from '@traent/ngx-components';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { StreamEntry, Document, StreamReferenceSnapshot, LogItemImage } from '@viewer/models';
import { StreamService, DocumentService, ProjectParticipantService } from '@viewer/services';
import { getProjectParticipantId, redactedClass, redactedValue, snapshotContent, snapshotParticipantLabel } from '@viewer/utils';
import { StreamReferenceV0 } from '@ledger-objects';

import { DocumentLogDialogComponent } from '../../document-log-dialog/document-log-dialog.component';
import { StreamLogDialogComponent } from '../../stream-log-dialog/stream-log-dialog.component';

@Component({
  selector: 'app-stream-reference-log-item',
  templateUrl: './stream-reference-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamReferenceLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<StreamReferenceSnapshot | null>(null);
  @Input() set snapshot(value: StreamReferenceSnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'stream-overview' },
    bgColor: 'opal-bg-blue-100',
    textColor: 'opal-text-blue-600',
  };

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
      const stream = await this.getStream(snapshot);
      const streamName = redactedValue(stream?.name);
      const streamStyle = redactedClass(stream?.name, 'pointer');

      const document = await this.getDocument(snapshot);
      const documentName = redactedValue(document?.name);
      const documentStyle = redactedClass(document?.name, 'pointer');

      return {
        documentName,
        documentStyle,
        member,
        operation: snapshot.operation,
        streamName,
        streamStyle,
      };
    }),
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly streamService: StreamService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: StreamReferenceSnapshot | null): Promise<void> {
    if (pointerClasses === 'stream' && snapshot) {
      const data = await this.getStream(snapshot);
      if (!data) {
        return;
      }

      await firstValueFrom(this.dialog.open(StreamLogDialogComponent, { data, panelClass: 'opal-w-600px' }).afterClosed());
    }
    if (pointerClasses === 'document' && snapshot) {
      const data = await this.getDocument(snapshot);
      if (!data) {
        return;
      }

      await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, { data, panelClass: 'w-600px' }).afterClosed());
    }
  }

  private async getStream(snapshot: StreamReferenceSnapshot): Promise<StreamEntry | undefined> {
    const streamId = snapshotContent<StreamReferenceV0>(snapshot).streamEntryId;
    return isExportedAndDefined(streamId) ? this.streamService.getStream(streamId, snapshot.updatedInBlock.index) : undefined;
  }

  private async getDocument(snapshot: StreamReferenceSnapshot): Promise<Document | undefined> {
    const documentId = snapshotContent<StreamReferenceV0>(snapshot).documentId;
    return isExportedAndDefined(documentId) ? this.documentService.getDocument(documentId, snapshot.updatedInBlock.index) : undefined;
  }
}
