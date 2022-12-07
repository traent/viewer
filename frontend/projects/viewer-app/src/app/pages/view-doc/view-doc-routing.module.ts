import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewDocComponent } from './view-doc.component';
import { LedgerUnloadGuard } from '../../core/guards/ledger-unload.guard';

const routes: Routes = [{
  path: '',
  component: ViewDocComponent,
  canDeactivate: [LedgerUnloadGuard],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewDocRoutingModule { }
