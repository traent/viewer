import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  NoValueLabelModule,
  RedactedModule,
  TagModule,
} from '@traent/ngx-components';

import { DocumentLogDialogComponent } from './document-log-dialog.component';
import { IdentityValidationModule } from '../../identity-validation/identity-validation.module';
import { Uint8PipeModule } from '../../uint8/uint8.module';
import { AcksStatusModule } from '../acks-status/acks-status.module';
import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';
import { RedactableTagModule } from '../redactable-tag/redactable-tag.module';


@NgModule({
  declarations: [
    DocumentLogDialogComponent,
  ],
  imports: [
    AcksStatusModule,
    CommonModule,
    IdentityValidationModule,
    MatButtonModule,
    RouterModule,
    MatDialogModule,
    CopyToClipboardModule,
    Uint8PipeModule,
    ApplyModule,
    MatIconModule,
    RedactedModule,
    NoValueLabelModule,
    TagModule,
    ParticipantIdentityModule,
    DescriptionsModule,
    RedactableTagModule,
    TranslateModule,
  ],
})
export class DocumentLogDialogModule { }
