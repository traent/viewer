import { Component, Input } from '@angular/core';
import { ViewerAgentType } from '@api/models';
import { AvatarPlaceholder, AvatarSize, WorkflowAvatar } from '@traent/ngx-components';
import { LedgerProjectParticipant, ProjectParticipant, WorkflowParticipant } from '@viewer/models';
import { BehaviorSubject, filter, switchMap, of } from 'rxjs';

import { getThingTypeInfo } from '../../../core/models/ui-things';

@Component({
  selector: 'app-participant-avatar-group',
  templateUrl: './participant-avatar-group.component.html',
  styleUrls: ['./participant-avatar-group.component.scss'],
})
export class ParticipantAvatarGroupComponent {
  readonly participant$ = new BehaviorSubject<ProjectParticipant | null | undefined>(null);
  @Input() set participant(participant: ProjectParticipant | null | undefined) {
    this.participant$.next(participant);
  }
  get participant(): ProjectParticipant | null | undefined {
    return this.participant$.value;
  }

  readonly agent$ = this.participant$.pipe(
    filter((p): p is LedgerProjectParticipant => p !== WorkflowParticipant),
    switchMap((participant) => participant ? participant.agent$ : of(undefined)),
  );
  readonly organization$ = this.participant$.pipe(
    filter((p): p is LedgerProjectParticipant => p !== WorkflowParticipant),
    switchMap((participant) => participant ? participant.organization$ : of(undefined)),
  );

  @Input() avatarSize: AvatarSize = 'xxs';
  @Input() showTooltip = true;
  @Input() workflowTooltip = 'Workflow';

  readonly AvatarPlaceholder = AvatarPlaceholder;
  readonly getThingTypeInfo = getThingTypeInfo;
  readonly ViewerAgentType = ViewerAgentType;
  readonly WorkflowAvatar = WorkflowAvatar;
}
