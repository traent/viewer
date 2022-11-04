import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  SkeletonModule,
  CopyToClipboardModule,
  IdentityModule,
} from '@traent/ngx-components';

import { Uint8PipeModule } from '../../uint8/uint8.module';
import { AcknowledgementsDialogComponent } from './acknowledgements-dialog.component';

@NgModule({
  declarations: [
    AcknowledgementsDialogComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    IdentityModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    SkeletonModule,
    TranslateModule,
    Uint8PipeModule,
  ],
  exports: [
    AcknowledgementsDialogComponent,
  ],
})
export class AcknowledgmentsDialogModule { }
