import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule, SkeletonModule, StreamModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ResourceReferenceModule } from '../resource-reference/resource-reference.module';
import { StreamReferencesComponent } from './stream-references.component';

@NgModule({
  declarations: [
    StreamReferencesComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    NgxT3PaginatorModule,
    ResourceReferenceModule,
    SkeletonModule,
    StreamModule,
    TranslateModule,
  ],
  exports: [
    StreamReferencesComponent,
  ],
})
export class StreamReferencesModule { }
