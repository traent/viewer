import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  ThreadModule,
  DescriptionsModule,
  IdentityModule,
  CopyToClipboardModule,
  RedactedModule,
  SkeletonModule,
} from '@traent/ngx-components';

import { ThreadOverviewComponent } from './thread-overview.component';
import { AcknowledgmentsDialogModule } from '../../dialogs/acknowledgments-dialog/acknowledgements-dialog.module';
import { Uint8PipeModule } from '../../uint8/uint8.module';
import { AcksStatusModule } from '../acks-status/acks-status.module';
import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';

@NgModule({
  declarations: [
    ThreadOverviewComponent,
  ],
  imports: [
    AcknowledgmentsDialogModule,
    AcksStatusModule,
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    IdentityModule,
    MatIconModule,
    MatTooltipModule,
    ParticipantIdentityModule,
    RedactedModule,
    SkeletonModule,
    ThreadModule,
    TranslateModule,
    Uint8PipeModule,
  ],
  exports: [
    ThreadOverviewComponent,
  ],
})
export class ThreadOverviewModule { }
