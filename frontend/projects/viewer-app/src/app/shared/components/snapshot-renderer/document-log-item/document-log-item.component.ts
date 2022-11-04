import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { MaterialOrCustomIcon } from '@traent/ngx-components';
import { BehaviorSubject, Observable, combineLatest, firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DocumentSnapshot, LogItemImage } from '@viewer/models';
import {
  snapshotParticipantLabel,
  getChanges,
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
} from '@viewer/utils';
import { DocumentV0 } from '@ledger-objects';
import { DocumentService, ProjectParticipantService } from '@viewer/services';

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
  private readonly snapshot$ = new BehaviorSubject<DocumentSnapshot | null>(null);
  @Input() set snapshot(value: DocumentSnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage$: Observable<LogItemImage> = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    map((snapshot) => ({
      type: 'icon',
      bgColor: 'opal-bg-grey-100',
      textColor: 'opal-text-grey-500',
      icon: getIconValue(snapshot),
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
    private readonly documentService: DocumentService,
    private readonly projectParticipantService: ProjectParticipantService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: DocumentSnapshot | null): Promise<void> {
    if (pointerClasses === 'document' && snapshot) {
      await firstValueFrom(this.dialog.open(DocumentLogDialogComponent, {
        data: this.documentService.parseDocument(snapshotContent<DocumentV0>(snapshot)),
        panelClass: 'opal-w-600px',
      }).afterClosed());
    }
  }
}
