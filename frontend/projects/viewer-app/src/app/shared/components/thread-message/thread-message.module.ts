import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ApplyModule,
  RedactedModule,
  ThingInlineInfoComponent,
  ThreadMessageThingAuthorInfoComponent,
  ThreadModule,
  TimeAgoPipeModule,
} from '@traent/ngx-components';

import { ThreadMessageComponent } from './thread-message.component';
import { AcksIconModule } from '../acks-icon/acks-icon.module';
import { IfPersonParticipantModule } from '../if-person-participant/if-person-participant.module';

@NgModule({
  declarations: [
    ThreadMessageComponent,
  ],
  imports: [
    AcksIconModule,
    ApplyModule,
    CommonModule,
    IfPersonParticipantModule,
    MatButtonModule,
    MatIconModule,
    RedactedModule,
    ThingInlineInfoComponent,
    ThreadMessageThingAuthorInfoComponent,
    ThreadModule,
    TimeAgoPipeModule,
  ],
  exports: [
    ThreadMessageComponent,
  ],
})
export class ThreadMessageModule { }
