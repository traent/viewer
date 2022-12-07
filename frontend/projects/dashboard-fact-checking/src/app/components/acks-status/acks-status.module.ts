import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CopyToClipboardModule, SkeletonModule } from '@traent/ngx-components';

import { AcksIconModule } from '../acks-icon/acks-icon.module';
import { AcksStatusComponent } from './acks-status.component';

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
  ],
  exports: [
    AcksStatusComponent,
  ],
})
export class AcksStatusModule { }
