import { isNotNullOrUndefined } from '@traent/ts-utils';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { isExportedAndDefined } from '@traent/ngx-components';
import { of, BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { LogItemImage, ProjectParticipant, ProjectParticipantSnapshot, WorkflowParticipant } from '@viewer/models';
import { redactedClass, redactedValue, roleToLabel, snapshotContent, snapshotParticipantLabel, workflowSnapshotImage } from '@viewer/utils';
import { MemberService, ProjectParticipantService } from '@viewer/services';
import { ProjectParticipantV0 } from '@ledger-objects';

const getIcon = (operation: string, participant?: ProjectParticipant): Observable<LogItemImage> => {
  if (!participant) {
    return of({
      type: 'doubleAvatar',
      icon: { material: operation === 'update' ? 'star' : 'chat' },
      bgColor: 'opal-bg-blue-600',
      textColor: 'opal-text-white',
      src: undefined,
    });
  }

  if (participant === WorkflowParticipant) {
    return of(workflowSnapshotImage);
  }

  return participant.member$.pipe(
    map((p) => ({
      type: 'doubleAvatar',
      icon: { material: operation === 'update' ? 'star' : 'chat' },
      bgColor: 'opal-bg-blue-600',
      textColor: 'opal-text-white',
      src: p?.avatar,
    })),
  );
};

@Component({
  selector: 'app-participant-log-item',
  templateUrl: './participant-log-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ParticipantLogItemComponent {
  private readonly snapshot$ = new BehaviorSubject<ProjectParticipantSnapshot | null>(null);
  @Input() set snapshot(value: ProjectParticipantSnapshot | null){
    this.snapshot$.next(value);
  };
  get snapshot() {
    return this.snapshot$.value;
  }

  readonly invitee$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    switchMap((snapshot) => this.getParticipant(snapshot)),
  );

  readonly inviteeMember$ = this.invitee$.pipe(
    switchMap((invitee) => snapshotParticipantLabel(invitee)),
  );

  readonly inviterMember$ = this.snapshot$.pipe(
    isNotNullOrUndefined(),
    switchMap(async (snapshot) => {
      const obj = snapshotContent<ProjectParticipantV0>(snapshot);
      return isExportedAndDefined(obj.creatorId)
        ? await this.projectParticipantService.getProjectParticipant(obj.creatorId)
        : undefined;
    }),
    switchMap((inviter) => snapshotParticipantLabel(inviter)),
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
    protected readonly memberService: MemberService,
    protected readonly projectParticipantService: ProjectParticipantService,
  ) { }

  // FIXME when snapshot.delta will hold participantId
  async getParticipant(snapshot: ProjectParticipantSnapshot): Promise<ProjectParticipant | undefined> {
    const participants = await this.projectParticipantService.getProjectParticipantCollection();
    const projectParticipant = participants.items
      .find((participant) => participant.memberId === snapshot.delta.memberId);
    return projectParticipant;
  }
}


