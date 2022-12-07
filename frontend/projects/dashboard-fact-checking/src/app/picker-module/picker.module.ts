import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { SearchBarModule, SkeletonModule, IconModule, NgxT3ListModule } from '@traent/ngx-components';
import { NgxT3TooltipModule } from '@traent/ngx-tooltip';

import { ItemPickerComponent } from './item-picker/item-picker.component';
import { PickableItemComponent } from './pickable-item/pickable-item.component';

@NgModule({
  declarations: [
    PickableItemComponent,
    ItemPickerComponent,
  ],
  imports: [
    A11yModule,
    CommonModule,
    IconModule,
    MatButtonModule,
    MatIconModule,
    NgxT3ListModule,
    NgxT3TooltipModule,
    SearchBarModule,
    SkeletonModule,
    TranslateModule,
  ],
  exports: [
    PickableItemComponent,
    ItemPickerComponent,
  ],
})
export class NgxT3PickerModule {
}
