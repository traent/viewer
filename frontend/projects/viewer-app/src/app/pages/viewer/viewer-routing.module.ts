import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewerComponent } from './viewer.component';
import { LedgerSelectedGuard } from '../../core/guards/ledger-selected.guard';

const routes: Routes = [{
  path: '',
  component: ViewerComponent,
  children: [
    {
      canActivate: [LedgerSelectedGuard],
      path: '',
      loadChildren: () => import('../project/project.module').then((m) => m.ProjectModule),
    },
    {
      path: 'select',
      loadChildren: () => import('../ledger-switch/ledger-switch.module').then((m) => m.LedgerSwitchModule),
    },
    {
      canActivate: [LedgerSelectedGuard],
      path: 'documents',
      loadChildren: () => import('../document/document.module').then((m) => m.DocumentModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewerRoutingModule { }
