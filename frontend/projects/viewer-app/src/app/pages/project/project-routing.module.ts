import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProjectPageComponent } from './project-page.component';
import { ProjectSideInfoComponent } from './project-side-info/project-side-info.component';
import { ProjectSideWorkflowComponent } from './project-side-workflow/project-side-workflow.component';
import { ProjectSideLogComponent } from './project-side-log/project-side-log.component';
import { ProjectSideComponent } from './project-side/project-side.component';
import { ProjectSideParticipantsComponent } from './project-side-participants/project-side-participants.component';
import { ProjectSideOrganizationsComponent } from './project-side-organizations/project-side-organizations.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectPageComponent,
    children: [
      {
        path: 'documents',
        loadChildren: () => import('./documents-page/documents.module').then((m) => m.DocumentsModule),
      },
      {
        path: 'streams',
        loadChildren: () => import('./streams-page/streams.module').then((m) => m.StreamModule),
      },
      {
        path: 'threads',
        loadChildren: () => import('./threads-page/threads.module').then((m) => m.ThreadsModule),
      },
      {
        path: '',
        redirectTo: 'documents',
        pathMatch: 'full',
      },
    ],
  },
];

export const projectSideBarRoutes: Routes = [
  {
    path: '',
    outlet: 'aside',
    component: ProjectSideComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'info',
      },
      {
        path: 'workflow',
        component: ProjectSideWorkflowComponent,
      },
      {
        path: 'info',
        component: ProjectSideInfoComponent,
      },
      {
        path: 'log',
        component: ProjectSideLogComponent,
      },
      {
        path: 'info/participants',
        component: ProjectSideParticipantsComponent,
      },
      {
        path: 'info/organizations',
        component: ProjectSideOrganizationsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {}
