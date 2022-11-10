import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LedgerStoredGuard } from './core/guards/ledger-stored.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'explorer',
    canActivate: [LedgerStoredGuard],
    loadChildren: () => import('./pages/explorer/explorer.module').then((m) => m.ExplorerPageModule),
  },
  {
    path: 'project',
    canActivate: [LedgerStoredGuard],
    loadChildren: () => import('./pages/viewer/viewer.module').then((m) => m.ViewerModule),
  },
  {
    path: 'view/:ledgerId/doc/:id',
    canActivate: [LedgerStoredGuard],
    loadChildren: () => import('./pages/view-doc/view-doc.module').then((m) => m.ViewDocModule),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(
    routes,
    { paramsInheritanceStrategy: 'always' },
  )],
  exports: [RouterModule],
})
export class AppRoutingModule { }
