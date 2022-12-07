import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  IconModule,
  IdentityModule,
  NoValueLabelModule,
  RedactedModule,
  SkeletonModule,
  StreamModule,
  TagModule,
} from '@traent/ngx-components';

import { StreamOverviewComponent } from './stream-overview.component';
import { AcknowledgmentsDialogModule } from '../../dialogs/acknowledgments-dialog/acknowledgements-dialog.module';
import { Uint8PipeModule } from '../../uint8/uint8.module';
import { AcksStatusModule } from '../acks-status/acks-status.module';
import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';
import { RedactableTagModule } from '../redactable-tag/redactable-tag.module';

@NgModule({
  declarations: [
    StreamOverviewComponent,
  ],
  imports: [
    AcknowledgmentsDialogModule,
    AcksStatusModule,
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    IconModule,
    IdentityModule,
    MatIconModule,
    MatTooltipModule,
    NoValueLabelModule,
    ParticipantIdentityModule,
    RedactableTagModule,
    RedactedModule,
    SkeletonModule,
    StreamModule,
    TagModule,
    TranslateModule,
    Uint8PipeModule,
  ],
  exports: [
    StreamOverviewComponent,
  ],
})
export class StreamOverviewModule { }
