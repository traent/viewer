import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ViewDocRoutingModule } from './view-doc-routing.module';
import { ViewDocComponent } from './view-doc.component';

@NgModule({
  imports: [
    CommonModule,
    ViewDocRoutingModule,
  ],
  declarations: [ViewDocComponent],
})
export class ViewDocModule { }
