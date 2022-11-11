import { Component, Input } from '@angular/core';
import { ProjectParticipant } from '@viewer/models';
import { IdentitySize, IdentityValidationSize, WorkflowAvatar } from '@traent/ngx-components';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-participant-identity',
  templateUrl: './participant-identity.component.html',
  styleUrls: ['./participant-identity.component.scss'],
})
export class ParticipantIdentityComponent {
  readonly participant$ = new BehaviorSubject<ProjectParticipant | null | undefined>(null);
  @Input() set participant(participant: ProjectParticipant | null | undefined) {
    this.participant$.next(participant);
  }
  get participant(): ProjectParticipant | null | undefined {
    return this.participant$.value;
  }

  @Input() size: IdentitySize = 'xxs';
  @Input() validationSize: IdentityValidationSize = 'xs';

  readonly WorkflowAvatar = WorkflowAvatar;

  get showSecondLine(): boolean {
    return !['xs', 'xxs', 'xxxs'].includes(this.size);
  }
}
