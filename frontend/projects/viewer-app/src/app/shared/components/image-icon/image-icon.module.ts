import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AvatarModule, CopyToClipboardModule, IconModule, SkeletonModule } from '@traent/ngx-components';

import { ImageIconComponent } from './image-icon.component';

@NgModule({
  declarations: [
    ImageIconComponent,
  ],
  imports: [
    CommonModule,
    CopyToClipboardModule,
    MatIconModule,
    MatTooltipModule,
    SkeletonModule,
    AvatarModule,
    CommonModule,
    IconModule,
    MatIconModule,
    SkeletonModule,
  ],
  exports: [
    ImageIconComponent,
  ],
})
export class ImageIconModule { }
