import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { ProjectParticipantV0 } from '@ledger-objects';
import { isExportedAndDefined } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { LogItemImage, ProjectParticipant, ProjectParticipantSnapshot, WorkflowParticipant } from '@viewer/models';
import { AgentService, ProjectParticipantService } from '@viewer/services';
import { redactedClass, redactedValue, roleToLabel, snapshotContent, snapshotParticipantLabel, workflowSnapshotImage } from '@viewer/utils';
import { of, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

const getIcon = (operation: string, participant?: ProjectParticipant): Observable<LogItemImage> => {
  if (!participant) {
    return of({
      type: 'doubleAvatar',
      icon: { material: operation === 'update' ? 'star' : 'chat' },
      bgColor: 'tw-bg-blue-600',
      textColor: 'tw-text-white',
      src: undefined,
    });
  }

  if (participant === WorkflowParticipant) {
    return of(workflowSnapshotImage);
  }

  return participant.agent$.pipe(
    map((p) => ({
      type: 'doubleAvatar',
      icon: { material: operation === 'update' ? 'star' : 'chat' },
      bgColor: 'tw-bg-blue-600',
      textColor: 'tw-text-white',
      src: p?.avatar
        ?? p?.type
        ? {
          custom: 'things',
        }
        : undefined,
    })),
  );
};

@Component({
  selector: 'app-participant-log-item',
  templateUrl: './participant-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantLogItemComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  @Input() set ledgerId(value: string | undefined) {
    this.ledgerId$.next(value);
  };

  private readonly snapshot$ = new BehaviorSubject<ProjectParticipantSnapshot | null>(null);
  @Input() set snapshot(value: ProjectParticipantSnapshot | null) {
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  private readonly invitee$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(switchMap(([ledgerId, snapshot]) => this.getParticipant(snapshot, ledgerId)));

  private readonly inviteeMember$ = this.invitee$.pipe(switchMap(snapshotParticipantLabel));

  private readonly inviterMember$ = combineLatest([
    this.ledgerId$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(async ([ledgerId, snapshot]) => {
      const obj = snapshotContent<ProjectParticipantV0>(snapshot);
      return isExportedAndDefined(obj.creatorId)
        ? await this.projectParticipantService.getProjectParticipant({ ledgerId, id: obj.creatorId })
        : undefined;
    }),
    switchMap(snapshotParticipantLabel),
  );

  readonly itemImage$ = combineLatest([
    this.invitee$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    switchMap(([projectParticipant, snapshot]) => getIcon(snapshot.operation, projectParticipant)),
  );

  readonly props$ = combineLatest([
    this.inviteeMember$,
    this.inviterMember$,
    this.snapshot$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    map(([inviteeParticipant, inviterParticipant, snapshot]) => ({
      inviter: inviterParticipant,
      operation: snapshot.operation,
      participant: inviteeParticipant,
      role: redactedValue(roleToLabel(snapshot.delta.role)),
      roleClass: redactedClass(roleToLabel(snapshot.delta.role)),
    })),
  );

  constructor(
    protected readonly agentService: AgentService,
    protected readonly projectParticipantService: ProjectParticipantService,
  ) { }

  // FIXME when snapshot.delta will hold participantId
  async getParticipant(snapshot: ProjectParticipantSnapshot, ledgerId?: string): Promise<ProjectParticipant | undefined> {
    const participants = await this.projectParticipantService.getProjectParticipantCollection({ ledgerId, page: 1 });
    const projectParticipant = participants.items
      .find((participant) => participant.memberId === snapshot.delta.memberId);
    return projectParticipant;
  }
}


