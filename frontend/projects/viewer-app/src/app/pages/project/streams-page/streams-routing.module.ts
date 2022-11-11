import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { projectSideBarRoutes } from '../project-routing.module';
import { StreamsPageComponent } from './streams-page.component';
import { StreamSideLogComponent } from './stream-side-log/stream-side-log.component';
import { StreamSideOverviewComponent } from './stream-side-overview/stream-side-overview.component';
import { StreamSideReferenceComponent } from './stream-side-reference/stream-side-reference.component';
import { StreamSidebarComponent } from './stream-sidebar/stream-sidebar.component';

const routes: Routes = [
  ...projectSideBarRoutes,
  {
    path: '',
    component: StreamsPageComponent,
  },
  {
    path: ':id',
    component: StreamsPageComponent,
  },
  {
    path: ':id',
    outlet: 'aside',
    component: StreamSidebarComponent,
    children: [
      {
        path: 'log',
        component: StreamSideLogComponent,
      },
      {
        path: 'info',
        children: [
          {
            path: '',
            component: StreamSideOverviewComponent,
          },
          {
            path: 'references',
            component: StreamSideReferenceComponent,
          },
        ],
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
export class StreamRoutingModule { }
