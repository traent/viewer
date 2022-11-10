import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewDocComponent } from './view-doc.component';

const routes: Routes = [{
  path: '',
  component: ViewDocComponent,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDocRoutingModule { }
