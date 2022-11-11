import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ApplyModule, ThreadModule, TimeAgoPipeModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { AcksIconModule } from '../acks-icon/acks-icon.module';
import { ThreadMessagesComponent } from './thread-messages.component';
import { ThreadMessageModule } from '../thread-message/thread-message.module';

@NgModule({
  declarations: [
    ThreadMessagesComponent,
  ],
  imports: [
    AcksIconModule,
    ApplyModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    NgxT3PaginatorModule,
    ThreadMessageModule,
    ThreadModule,
    TimeAgoPipeModule,
    TranslateModule,
  ],
  exports: [
    ThreadMessagesComponent,
  ],
})
export class ThreadMessagesModule { }
