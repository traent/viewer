import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewDocComponent } from './view-doc.component';
import { ViewDocRoutingModule } from './view-doc-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ViewDocRoutingModule,
  ],
  declarations: [ViewDocComponent],
})
export class ViewDocModule { }
