import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CopyToClipboardModule, SkeletonModule } from '@traent/ngx-components';

import { AcksStatusComponent } from './acks-status.component';
import { AcksIconModule } from '../acks-icon/acks-icon.module';

@NgModule({
  declarations: [
    AcksStatusComponent,
  ],
  imports: [
    AcksIconModule,
    CommonModule,
    CopyToClipboardModule,
    MatIconModule,
    SkeletonModule,
    TranslateModule,
  ],
  exports: [
    AcksStatusComponent,
  ],
})
export class AcksStatusModule { }
