import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  AvatarModule,
  CopyToClipboardModule,
  DescriptionsModule,
  FieldValueModule,
  IconModule,
  IdentityModule,
  NoValueLabelModule,
  RedactedModule,
  SkeletonModule,
  StreamModule,
  ValueChangedModule,
} from '@traent/ngx-components';

import { StreamSnapshotDetailComponent } from './stream-snapshot-detail.component';
import { Uint8PipeModule } from '../../uint8/uint8.module';
import { ParticipantIdentityModule } from '../participant-identity/participant-identity.module';

@NgModule({
  declarations: [
    StreamSnapshotDetailComponent,
  ],
  imports: [
    ApplyModule,
    AvatarModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    FieldValueModule,
    IconModule,
    IdentityModule,
    MatIconModule,
    MatTooltipModule,
    NoValueLabelModule,
    ParticipantIdentityModule,
    RedactedModule,
    SkeletonModule,
    StreamModule,
    Uint8PipeModule,
    TranslateModule,
    ValueChangedModule,
  ],
  exports: [
    StreamSnapshotDetailComponent,
  ],
})
export class StreamSnapshotDetailModule { }
