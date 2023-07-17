import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  SkeletonModule,
  CopyToClipboardModule,
  IdentityModule,
} from '@traent/ngx-components';

import { AcknowledgementsDialogComponent } from './acknowledgements-dialog.component';
import { Uint8PipeModule } from '../../uint8/uint8.module';

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
    SkeletonModule,
    TranslateModule,
    Uint8PipeModule,
  ],
  exports: [
    AcknowledgementsDialogComponent,
  ],
})
export class AcknowledgmentsDialogModule { }
