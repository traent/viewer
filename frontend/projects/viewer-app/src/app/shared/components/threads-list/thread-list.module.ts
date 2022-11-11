import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule, ThreadModule, TimeAgoPipeModule, TabsModule, GrowingSearchBarModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ThreadListComponent } from './thread-list.component';

@NgModule({
  declarations: [
    ThreadListComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    GrowingSearchBarModule,
    NgxT3PaginatorModule,
    ThreadModule,
    TabsModule,
    TimeAgoPipeModule,
    TranslateModule,
  ],
  exports: [
    ThreadListComponent,
  ],
})
export class ThreadListModule { }
