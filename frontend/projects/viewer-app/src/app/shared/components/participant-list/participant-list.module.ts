import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ApplyModule, IdentityModule, SkeletonModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';
import { ParticipantListComponent } from './participant-list.component';

@NgModule({
  declarations: [
    ParticipantListComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    IdentityModule,
    NgxT3PaginatorModule,
    ParticipantIdentityModule,
    SkeletonModule,
  ],
  exports: [
    ParticipantListComponent,
  ],
})
export class ParticipantListModule { }
