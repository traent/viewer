import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LedgerSelectedGuard } from './core/guards/ledger-selected.guard';
import { LedgerStoredGuard } from './core/guards/ledger-stored.guard';
import { UiRefreshPageComponent } from './pages/ui-refresh-page/ui-refresh-page.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: 'explorer',
    canActivate: [LedgerStoredGuard, LedgerSelectedGuard],
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
    path: 'ui-refresh',
    canActivate: [LedgerStoredGuard, LedgerSelectedGuard],
    component: UiRefreshPageComponent,
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
