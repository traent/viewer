import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplyModule, IdentityModule } from '@traent/ngx-components';

import { ParticipantIdentityComponent } from './participant-identity.component';
import { IdentityValidationModule } from '../../identity-validation/identity-validation.module';
import { IfPersonParticipantModule } from '../if-person-participant/if-person-participant.module';

@NgModule({
  declarations: [
    ParticipantIdentityComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    IdentityModule,
    IdentityValidationModule,
    IfPersonParticipantModule,
  ],
  exports: [
    ParticipantIdentityComponent,
  ],
})
export class ParticipantIdentityModule { }
