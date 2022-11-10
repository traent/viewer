import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { CopyToClipboardModule, SkeletonModule } from '@traent/ngx-components';

import { AcksIconComponent } from './acks-icon.component';

@NgModule({
  declarations: [
    AcksIconComponent,
  ],
  imports: [
    CommonModule,
    CopyToClipboardModule,
    MatIconModule,
    MatTooltipModule,
    SkeletonModule,
    TranslateModule,
  ],
  exports: [
    AcksIconComponent,
  ],
})
export class AcksIconModule { }
