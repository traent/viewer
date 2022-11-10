import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NoValueLabelModule, RedactedModule, TagModule } from '@traent/ngx-components';

import { RedactableTagComponent } from './redactable-tag.component';

@NgModule({
  declarations: [
    RedactableTagComponent,
  ],
  imports: [
    CommonModule,
    MatTooltipModule,
    NoValueLabelModule,
    RedactedModule,
    TagModule,
    TranslateModule,
  ],
  exports: [
    RedactableTagComponent,
  ],
})
export class RedactableTagModule { }
