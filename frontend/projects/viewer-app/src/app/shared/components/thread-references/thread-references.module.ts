import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceReferenceModule } from '@viewer/shared';
import { ApplyModule, ThreadModule, SkeletonModule, RedactedModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ThreadReferencesComponent } from './thread-references.component';

@NgModule({
  declarations: [
    ThreadReferencesComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    NgxT3PaginatorModule,
    RedactedModule,
    ResourceReferenceModule,
    SkeletonModule,
    ThreadModule,
    TranslateModule,
  ],
  exports: [
    ThreadReferencesComponent,
  ],
})
export class ThreadReferencesModule { }
