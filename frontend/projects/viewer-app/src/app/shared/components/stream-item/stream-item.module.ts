import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  IconModule,
  RedactedModule,
  StreamModule,
} from '@traent/ngx-components';

import { StreamItemComponent } from './stream-item.component';

@NgModule({
  declarations: [
    StreamItemComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    IconModule,
    MatIconModule,
    RedactedModule,
    StreamModule,
    TranslateModule,
  ],
  exports: [
    StreamItemComponent,
  ],
})
export class StreamItemModule { }
