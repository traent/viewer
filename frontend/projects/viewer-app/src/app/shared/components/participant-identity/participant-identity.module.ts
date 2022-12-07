import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  IdentityModule,
  ThingAvatarComponent,
  ThingInlineInfoComponent,
  ThingInlineTypeComponent,
} from '@traent/ngx-components';

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
    ThingAvatarComponent,
    ThingInlineInfoComponent,
    ThingInlineTypeComponent,
    TranslateModule,
  ],
  exports: [
    ParticipantIdentityComponent,
  ],
})
export class ParticipantIdentityModule { }
