import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { StreamListComponent } from './stream-list.component';
import { StreamItemModule } from '../stream-item/stream-item.module';

@NgModule({
  declarations: [
    StreamListComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    NgxT3PaginatorModule,
    StreamItemModule,
    TranslateModule,
  ],
  exports: [
    StreamListComponent,
  ],
})
export class StreamListModule { }
