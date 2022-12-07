import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentV0 } from '@ledger-objects';
import { MaterialOrCustomIcon } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { DocumentSnapshot, LogItemImage } from '@viewer/models';
import { parseDocument, ProjectParticipantService } from '@viewer/services';
import {
  snapshotParticipantLabel,
  getChanges,
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
} from '@viewer/utils';
import { BehaviorSubject, Observable, combineLatest, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DocumentLogDialogComponent } from '../../document-log-dialog/document-log-dialog.component';

const getIconValue = (snapshot: DocumentSnapshot): MaterialOrCustomIcon => {
  const isDocumentRename = getIsDocumentRename(snapshot);
  switch (snapshot.operation) {
    case 'creation': return {
      material: 'note_add',
    };
    case 'update': return isDocumentRename
      ? { material: 'insert_drive_file' }
      : { custom: 'document-upload' };
    case 'deletion': return {
      custom: 'document-remove',
    };
  }
};

const getIsDocumentRename = (snapshot: DocumentSnapshot) => snapshot.operation === 'update'
  && getChanges(snapshot.delta, ['name']).length === 1;

@Component({
  selector: 'app-document-log-item',
  templateUrl: './document-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

  private readonly snapshot$ = new BehaviorSubject<DocumentSnapshot | null>(null);
  @Input() set snapshot(value: DocumentSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage$: Observable<LogItemImage> = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((snapshot) => ({
      type: 'icon',
      bgColor: 'tw-bg-red-100',
      textColor: 'tw-text-red-500',
      icon: getIconValue(snapshot),
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
    this.snapshot$.pipe(isNotNullOrUndefined()),
    this.projectParticipant$,
  ]).pipe(
    map(([snapshot, member]) => {
      const obj = snapshotContent<DocumentV0>(snapshot);
      const documentName = redactedValue(obj.name);
      const documentInnerClasses = redactedClass(obj.name, 'pointer');
      const previousDocumentName = redactedValue(snapshot.previous?.name);
      const previousDocumentInnerClasses = redactedClass(snapshot.previous?.name);
      const isDocumentRename = getIsDocumentRename(snapshot);

      return {
        documentInnerClasses,
        documentName,
        isDocumentRename,
        member,
        operation: snapshot.operation,
        previousDocumentInnerClasses,
        previousDocumentName,
      };
    }),
  );

  constructor(
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: DocumentSnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'document' && snapshot) {
      const document = parseDocument(snapshotContent<DocumentV0>(snapshot));
      await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, {
        data: { ledgerId, document },
        panelClass: 'tw-w-[600px]',
      }).afterClosed());
    }
  }
}
