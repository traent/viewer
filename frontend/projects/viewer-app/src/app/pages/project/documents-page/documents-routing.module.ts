import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { projectSideBarRoutes } from '../project-routing.module';
import { DocumentSideLogComponent } from './document-side-log/document-side-log.component';
import { DocumentSideOverviewComponent } from './document-side-overview/document-side-overview.component';
import { DocumentSidebarComponent } from './document-sidebar/document-sidebar.component';
import { DocumentsPageComponent } from './documents-page.component';

const routes: Routes = [
  ...projectSideBarRoutes,
  {
    path: '',
    component: DocumentsPageComponent,
  },
  {
    path: ':id',
    component: DocumentsPageComponent,
  },
  {
    path: ':id',
    outlet: 'aside',
    component: DocumentSidebarComponent,
    children: [
      {
        path: 'info',
        component: DocumentSideOverviewComponent,
      },
      {
        path: 'log',
        component: DocumentSideLogComponent,
      },
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentsRoutingModule { }
