import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule } from '@traent/ngx-components';

import { ParticipantAvatarGroupComponent } from './participant-avatar-group.component';
import { IfPersonParticipantModule } from '../if-person-participant/if-person-participant.module';

@NgModule({
  declarations: [
    ParticipantAvatarGroupComponent,
  ],
  imports: [
    AvatarModule,
    CommonModule,
    IfPersonParticipantModule,
    MatTooltipModule,
  ],
  exports: [
    ParticipantAvatarGroupComponent,
  ],
})
export class ParticipantAvatarGroupModule { }
