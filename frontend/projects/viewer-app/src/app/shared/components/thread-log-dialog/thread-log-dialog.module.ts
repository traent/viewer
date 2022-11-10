import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  IconModule,
  NoValueLabelModule,
  RedactedModule,
  StreamModule,
  TagModule,
} from '@traent/ngx-components';

import { IdentityValidationModule } from '../../identity-validation/identity-validation.module';
import { Uint8PipeModule } from '../../uint8/uint8.module';
import { AcksStatusModule } from '../acks-status/acks-status.module';
import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';
import { RedactableTagModule } from '../redactable-tag/redactable-tag.module';
import { ThreadLogDialogComponent } from './thread-log-dialog.component';

@NgModule({
  declarations: [
    ThreadLogDialogComponent,
  ],
  imports: [
    AcksStatusModule,
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    IconModule,
    IdentityValidationModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    NoValueLabelModule,
    ParticipantIdentityModule,
    RedactableTagModule,
    RedactedModule,
    RouterModule,
    StreamModule,
    TagModule,
    TranslateModule,
    Uint8PipeModule,
  ],
})
export class ThreadLogDialogModule { }
