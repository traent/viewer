import { MatDialog } from '@angular/material/dialog';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { map, switchMap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { LogItemImage, ProjectSnapshot } from '@viewer/models';
import {
  snapshotParticipantLabel,
  getChanges,
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
} from '@viewer/utils';
import { ProjectV0 } from '@ledger-objects';
import { parseProject, ProjectParticipantService } from '@viewer/services';

import { ProjectLogDialogComponent } from '../../project-log-dialog/project-log-dialog.component';

const getProjectUpdateType = (snapshot: ProjectSnapshot): 'name' | 'description' | 'generic' => {
  const changes = getChanges(snapshot.delta, ['name', 'description']);
  if (changes.includes('name') && changes.length === 1) {
    return 'name';
  }
  if (changes.includes('description') && changes.length === 1) {
    return 'description';
  }
  return 'generic';
};

const getProjectUpdateLabel = (type: 'name' | 'description' | 'generic'): string => {
  switch (type) {
    case 'name': return 'i18n.SnapshotItem.OperationLabel.Project.rename';
    case 'description': return 'i18n.SnapshotItem.OperationLabel.Project.editDescription';
    default: return 'i18n.SnapshotItem.OperationLabel.Project.update';
  }
};

@Component({
  selector: 'app-project-log-item',
  templateUrl: './project-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<ProjectSnapshot | null>(null);
  @Input() set snapshot(value: ProjectSnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'project-log' },
    bgColor: 'opal-bg-grey-100',
    textColor: 'opal-text-grey-500',
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
    map(([snapshot, member]) => {
      const obj = snapshotContent<ProjectV0>(snapshot);

      return {
        member,
        operation: snapshot.operation,
        previousProjectNameClass: redactedClass(snapshot.previous?.name),
        previousProjectNameValue: redactedValue(snapshot.previous?.name),
        projectNameClass: redactedClass(obj.name),
        projectNameValue: redactedValue(obj.name),
        updateType: getProjectUpdateType(snapshot),
      };
    }),
  );

  readonly getProjectUpdateLabel = getProjectUpdateLabel;

  constructor(
    private readonly dialog: MatDialog,
    private readonly projectParticipantService: ProjectParticipantService,
  ) { }

  async clickHandler(pointerClasses: string, snapshot: ProjectSnapshot | null): Promise<void> {
    if (pointerClasses === 'member' && snapshot) {
      await firstValueFrom(this.dialog.open(ProjectLogDialogComponent, {
        data: parseProject(snapshotContent<ProjectV0>(snapshot)),
        panelClass: 'opal-w-600px',
      }).afterClosed());
    }
  };
}
