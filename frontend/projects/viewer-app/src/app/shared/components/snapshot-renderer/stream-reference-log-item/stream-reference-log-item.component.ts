import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StreamReferenceV0 } from '@ledger-objects';
import { isExportedAndDefined } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { StreamEntry, Document, StreamReferenceSnapshot, LogItemImage } from '@viewer/models';
import { StreamService, DocumentService, ProjectParticipantService } from '@viewer/services';
import { getProjectParticipantId, redactedClass, redactedValue, snapshotContent, snapshotParticipantLabel } from '@viewer/utils';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DocumentLogDialogComponent } from '../../document-log-dialog/document-log-dialog.component';
import { StreamLogDialogComponent } from '../../stream-log-dialog/stream-log-dialog.component';

@Component({
  selector: 'app-stream-reference-log-item',
  templateUrl: './stream-reference-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamReferenceLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

  private readonly snapshot$ = new BehaviorSubject<StreamReferenceSnapshot | null>(null);
  @Input() set snapshot(value: StreamReferenceSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'stream-overview' },
    bgColor: 'tw-bg-blue-100',
    textColor: 'tw-text-blue-600',
  };

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
      const stream = await this.getStream(snapshot, ledgerId);
      const streamName = redactedValue(stream?.name);
      const streamStyle = redactedClass(stream?.name, 'pointer');

      const document = await this.getDocument(snapshot, ledgerId);
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

  async clickHandler(pointerClasses: string, snapshot: StreamReferenceSnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'stream' && snapshot) {
      const stream = await this.getStream(snapshot, ledgerId);
      if (!stream) {
        return;
      }

      await firstValueFrom(this.dialog.open(StreamLogDialogComponent, {
        data: { ledgerId, stream },
        panelClass: 'tw-w-[600px]',
      }).afterClosed());
    }
    if (pointerClasses === 'document' && snapshot) {
      const document = await this.getDocument(snapshot, ledgerId);
      if (!document) {
        return;
      }

      await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, {
        data: { ledgerId, document },
        panelClass: 'tw-w-[600px]',
      }).afterClosed());
    }
  }

  private async getStream(snapshot: StreamReferenceSnapshot, ledgerId: string | undefined): Promise<StreamEntry | undefined> {
    const streamId = snapshotContent<StreamReferenceV0>(snapshot).streamEntryId;
    return isExportedAndDefined(streamId)
      ? this.streamService.getStream({ ledgerId, id: streamId, blockIndex: snapshot.updatedInBlock.index })
      : undefined;
  }

  private async getDocument(snapshot: StreamReferenceSnapshot, ledgerId: string | undefined): Promise<Document | undefined> {
    const documentId = snapshotContent<StreamReferenceV0>(snapshot).documentId;
    return isExportedAndDefined(documentId)
      ? this.documentService.getDocument({ ledgerId, id: documentId, blockIndex: snapshot.updatedInBlock.index })
      : undefined;
  }
}
