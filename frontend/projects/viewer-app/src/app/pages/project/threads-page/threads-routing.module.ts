import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { projectSideBarRoutes } from '../project-routing.module';
import { ThreadMessagesPageComponent } from './thread-messages-page/thread-messages-page.component';
import { ThreadSideLogComponent } from './thread-side-log/thread-side-log.component';
import { ThreadSideOverviewComponent } from './thread-side-overview/thread-side-overview.component';
import { ThreadSideReferenceComponent } from './thread-side-reference/thread-side-reference.component';
import { ThreadSideParticipantsComponent } from './thread-side-participants/thread-side-participants.component';
import { ThreadSidebarComponent } from './thread-sidebar/thread-sidebar.component';
import { ThreadsPageComponent } from './threads-page.component';

const routes: Routes = [
  ...projectSideBarRoutes,
  {
    path: '',
    component: ThreadsPageComponent,
    children: [
      {
        path: ':id',
        component: ThreadMessagesPageComponent,
      },
    ],
  },
  {
    path: ':id',
    outlet: 'aside',
    component: ThreadSidebarComponent,
    children: [
      {
        path: 'info',
        children: [
          {
            path: '',
            component: ThreadSideOverviewComponent,
          },
          {
            path: 'references',
            component: ThreadSideReferenceComponent,
          },
          {
            path: 'participants',
            component: ThreadSideParticipantsComponent,
          },
        ],
      },
      {
        path: 'log',
        component: ThreadSideLogComponent,
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
export class ThreadsRoutingModule { }
