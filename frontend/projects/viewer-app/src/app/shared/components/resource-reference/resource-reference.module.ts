import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule, NoValueLabelModule, RedactedModule, SkeletonModule } from '@traent/ngx-components';

import { ResourceReferenceComponent } from './resource-reference.component';


@NgModule({
  declarations: [
    ResourceReferenceComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NoValueLabelModule,
    RedactedModule,
    SkeletonModule,
    TranslateModule,
  ],
  exports: [
    ResourceReferenceComponent,
  ],
})
export class ResourceReferenceModule { }
