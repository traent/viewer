import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { isExportedAndDefined } from '@traent/ngx-components';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Thread, ThreadReferenceSnapshot, Document, LogItemImage } from '@viewer/models';
import { getProjectParticipantId, redactedClass, redactedValue, snapshotContent, snapshotParticipantLabel } from '@viewer/utils';
import { ThreadService, DocumentService, ProjectParticipantService } from '@viewer/services';
import { ThreadReferenceV0 } from '@ledger-objects';

import { DocumentLogDialogComponent } from '../../document-log-dialog/document-log-dialog.component';
import { ThreadLogDialogComponent } from '../../thread-log-dialog/thread-log-dialog.component';

@Component({
  selector: 'app-thread-reference-log-item',
  templateUrl: './thread-reference-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadReferenceLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<ThreadReferenceSnapshot | null>(null);
  @Input() set snapshot(value: ThreadReferenceSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage$: Observable<LogItemImage> = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((_) => ({
      type: 'icon',
      icon: { custom: 'thread-reference' },
      bgColor: 'opal-bg-ottanio-100',
      textColor: 'opal-text-ottanio-600',
    })),
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
      const thread = await this.getThread(snapshot);
      const threadName = redactedValue(thread?.name);
      const threadStyle = redactedClass(thread?.name, 'pointer');

      const document = await this.getDocument(snapshot);
      const documentName = redactedValue(document?.name);
      const documentStyle = redactedClass(document?.name, 'pointer');

      return {
        documentName,
        documentStyle,
        member,
        operation: snapshot.operation,
        threadName,
        threadStyle,
      };
    }),
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly threadService: ThreadService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: ThreadReferenceSnapshot | null): Promise<void> {
    if (pointerClasses === 'thread' && snapshot) {
      const data = await this.getThread(snapshot);
      if (!data) {
        return;
      }

      await firstValueFrom(this.dialog.open(ThreadLogDialogComponent, { data, panelClass: 'opal-w-600px' }).afterClosed());
    }
    if (pointerClasses === 'document' && snapshot) {
      const data = await this.getDocument(snapshot);
      if (!data) {
        return;
      }

      await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, { data, panelClass: 'opal-w-600px' }).afterClosed());
    }
  }

  private async getThread(snapshot: ThreadReferenceSnapshot): Promise<Thread | undefined> {
    const threadId = snapshotContent<ThreadReferenceV0>(snapshot).threadId;
    return isExportedAndDefined(threadId) ? this.threadService.getThread(threadId, snapshot.updatedInBlock.index) : undefined;
  }

  private async getDocument(snapshot: ThreadReferenceSnapshot): Promise<Document | undefined> {
    const documentId = snapshotContent<ThreadReferenceV0>(snapshot).documentId;
    return isExportedAndDefined(documentId)
      ? this.documentService.getDocument(documentId, snapshot.updatedInBlock.index)
      : undefined;
  }
}


