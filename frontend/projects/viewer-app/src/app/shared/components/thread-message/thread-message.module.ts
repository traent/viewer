import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApplyModule, ThreadModule, TimeAgoPipeModule, RedactedModule } from '@traent/ngx-components';

import { AcksIconModule } from '../acks-icon/acks-icon.module';
import { IfPersonParticipantModule } from '../if-person-participant/if-person-participant.module';
import { ThreadMessageComponent } from './thread-message.component';

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
    ThreadModule,
    TimeAgoPipeModule,
  ],
  exports: [
    ThreadMessageComponent,
  ],
})
export class ThreadMessageModule { }
