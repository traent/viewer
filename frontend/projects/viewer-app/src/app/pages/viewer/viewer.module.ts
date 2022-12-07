import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TopbarModule } from '@viewer/shared';

import { ViewerRoutingModule } from './viewer-routing.module';
import { ViewerComponent } from './viewer.component';

@NgModule({
  declarations: [
    ViewerComponent,
  ],
  imports: [
    CommonModule,
    ViewerRoutingModule,
    TopbarModule,
  ],
})
export class ViewerModule { }
