import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NoValueLabelModule, RedactedModule, SkeletonModule, TagModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { CrossProjectReferencesListComponent } from './cross-project-references-list.component';
import { AcksIconModule } from '../acks-icon/acks-icon.module';

@NgModule({
  declarations: [
    CrossProjectReferencesListComponent,
  ],
  imports: [
    AcksIconModule,
    CommonModule,
    MatDialogModule,
    MatTooltipModule,
    NgxT3PaginatorModule,
    NoValueLabelModule,
    RedactedModule,
    SkeletonModule,
    TagModule,
    TranslateModule,
  ],
  exports: [
    CrossProjectReferencesListComponent,
  ],
})
export class CrossProjectReferencesListModule { }
