import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ProjectSideParticipantsListComponent } from './project-side-participants-list.component';
import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';

@NgModule({
  declarations: [ProjectSideParticipantsListComponent],
  imports: [
    CommonModule,
    NgxT3PaginatorModule,
    ParticipantIdentityModule,
  ],
  exports: [ProjectSideParticipantsListComponent],
})
export class ProjectSideParticipantsListModule { }
