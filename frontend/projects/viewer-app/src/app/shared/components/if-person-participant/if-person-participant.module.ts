import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IfPersonParticipantDirective } from './if-person-participant.directive';

@NgModule({
  declarations: [
    IfPersonParticipantDirective,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    IfPersonParticipantDirective,
  ],
})
export class IfPersonParticipantModule { }
