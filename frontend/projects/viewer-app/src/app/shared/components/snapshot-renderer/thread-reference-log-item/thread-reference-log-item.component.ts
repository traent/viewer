import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ThreadReferenceV0 } from '@ledger-objects';
import { isExportedAndDefined } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Thread, ThreadReferenceSnapshot, Document, LogItemImage } from '@viewer/models';
import { ThreadService, DocumentService, ProjectParticipantService } from '@viewer/services';
import { getProjectParticipantId, redactedClass, redactedValue, snapshotContent, snapshotParticipantLabel } from '@viewer/utils';
import { BehaviorSubject, combineLatest, firstValueFrom, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocumentLogDialogComponent } from '../../document-log-dialog/document-log-dialog.component';
import { ThreadLogDialogComponent } from '../../thread-log-dialog/thread-log-dialog.component';

@Component({
  selector: 'app-thread-reference-log-item',
  templateUrl: './thread-reference-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThreadReferenceLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

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
      bgColor: 'tw-bg-cyan-100',
      textColor: 'tw-text-cyan-600',
    })),
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
      const thread = await this.getThread(snapshot, ledgerId);
      const threadName = redactedValue(thread?.name);
      const threadStyle = redactedClass(thread?.name, 'pointer');

      const document = await this.getDocument(snapshot, ledgerId);
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

  async clickHandler(pointerClasses: string, snapshot: ThreadReferenceSnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'thread' && snapshot) {
      const thread = await this.getThread(snapshot, ledgerId);
      if (!thread) {
        return;
      }

      await firstValueFrom(this.dialog.open(ThreadLogDialogComponent, {
        data: { ledgerId, thread },
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

  private async getThread(snapshot: ThreadReferenceSnapshot, ledgerId: string | undefined): Promise<Thread | undefined> {
    const threadId = snapshotContent<ThreadReferenceV0>(snapshot).threadId;
    return isExportedAndDefined(threadId) ?
      this.threadService.getThread({ ledgerId, id: threadId, blockIndex: snapshot.updatedInBlock.index })
      : undefined;
  }

  private async getDocument(snapshot: ThreadReferenceSnapshot, ledgerId: string | undefined): Promise<Document | undefined> {
    const documentId = snapshotContent<ThreadReferenceV0>(snapshot).documentId;
    return isExportedAndDefined(documentId)
      ? this.documentService.getDocument({ ledgerId, id: documentId, blockIndex: snapshot.updatedInBlock.index })
      : undefined;
  }
}


