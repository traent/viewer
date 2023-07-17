import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectSideLogListComponent } from '@viewer/shared';

import { ProjectPageComponent } from './project-page.component';
import { ProjectSideComponent } from './project-side/project-side.component';
import {
  ProjectSideCrossProjectReferencesComponent,
} from './project-side-cross-project-references/project-side-cross-project-references.component';
import { ProjectSideInfoComponent } from './project-side-info/project-side-info.component';
import { ProjectSideOrganizationsComponent } from './project-side-organizations/project-side-organizations.component';
import { ProjectSideParticipantsComponent } from './project-side-participants/project-side-participants.component';
import { ProjectSideWorkflowComponent } from './project-side-workflow/project-side-workflow.component';
import { LedgerUnloadGuard } from '../../core/guards/ledger-unload.guard';

const routes: Routes = [
  {
    path: '',
    canDeactivate: [LedgerUnloadGuard],
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
        component: ProjectSideLogListComponent,
      },
      {
        path: 'info/participants',
        component: ProjectSideParticipantsComponent,
      },
      {
        path: 'info/organizations',
        component: ProjectSideOrganizationsComponent,
      },
      {
        path: 'info/linked-projects',
        component: ProjectSideCrossProjectReferencesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule { }
