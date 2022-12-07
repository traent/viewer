import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProjectV0 } from '@ledger-objects';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { LogItemImage, ProjectSnapshot } from '@viewer/models';
import { parseProject, ProjectParticipantService } from '@viewer/services';
import {
  snapshotParticipantLabel,
  getChanges,
  getProjectParticipantId,
  redactedClass,
  redactedValue,
  snapshotContent,
} from '@viewer/utils';
import { BehaviorSubject, combineLatest, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

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
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };
  get ledgerId() {
    return this.ledgerId$.value;
  }

  private readonly snapshot$ = new BehaviorSubject<ProjectSnapshot | null>(null);
  @Input() set snapshot(value: ProjectSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly itemImage: LogItemImage = {
    type: 'icon',
    icon: { custom: 'project-log' },
    bgColor: 'tw-bg-neutral-100',
    textColor: 'tw-text-neutral-500',
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

  async clickHandler(pointerClasses: string, snapshot: ProjectSnapshot | null, ledgerId: string | undefined): Promise<void> {
    if (pointerClasses === 'member' && snapshot) {
      const project = parseProject(snapshotContent<ProjectV0>(snapshot));
      await firstValueFrom(this.dialog.open(ProjectLogDialogComponent, {
        data: { ledgerId, project },
        panelClass: 'tw-w-[600px]',
      }).afterClosed());
    }
  };
}
