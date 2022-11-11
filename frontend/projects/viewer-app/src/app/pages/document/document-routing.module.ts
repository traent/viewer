import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DocumentContentComponent } from './document-content/document-content.component';
import { DocumentSideAnchorsListComponent } from './document-content/document-side-anchors-list/document-side-anchors-list.component';
import { DocumentSideLogComponent } from './document-content/document-side-log/document-side-log.component';
import { DocumentSideStreamListComponent } from './document-content/document-side-stream-list/document-side-stream-list.component';
import { DocumentSideStreamLogsComponent } from './document-content/document-side-stream-logs/document-side-stream-logs.component';
import {
  DocumentSideStreamOverviewComponent,
} from './document-content/document-side-stream-overview/document-side-stream-overview.component';
import {
  DocumentSideStreamReferencesComponent,
} from './document-content/document-side-stream-references/document-side-stream-references.component';
import {
  DocumentSideThreadListComponent,
} from './document-content/document-side-thread-list/document-side-thread-list.component';
import {
  DocumentSideThreadMessageOverviewComponent,
} from './document-content/document-side-thread-message-overview/document-side-thread-message-overview.component';
import {
  DocumentSideThreadMessagesComponent,
} from './document-content/document-side-thread-messages/document-side-thread-messages.component';
import {
  DocumentSideThreadOverviewComponent,
} from './document-content/document-side-thread-overview/document-side-thread-overview.component';
import {
  DocumentSideThreadParticipantsComponent,
} from './document-content/document-side-thread-participants/document-side-thread-participants.component';
import {
  DocumentSideThreadReferencesComponent,
} from './document-content/document-side-thread-references/document-side-thread-references.component';
import { DocumentVersionsComponent } from './document-versions/document-versions.component';
import { DocumentComponent } from './document.component';

const routes: Routes = [{
  path: ':id',
  component: DocumentComponent,
  children: [{
    path: 'content',
    component: DocumentContentComponent,
    children: [{
      path: '',
      component: DocumentSideAnchorsListComponent,
      children: [
        {
          path: 'threads',
          component: DocumentSideThreadListComponent,
        },
        {
          path: 'threads/:threadId',
          component: DocumentSideThreadOverviewComponent,
        },
        {
          path: 'threads/:threadId/messages',
          component: DocumentSideThreadMessagesComponent,
        },
        {
          path: 'threads/:threadId/references',
          component: DocumentSideThreadReferencesComponent,
        },
        {
          path: 'threads/:threadId/participants',
          component: DocumentSideThreadParticipantsComponent,
        },
        {
          path: 'threads/:threadId/messages/:massageId',
          component: DocumentSideThreadMessageOverviewComponent,
        },
        {
          path: 'streams',
          component: DocumentSideStreamListComponent,
        },
        {
          path: 'streams/:streamId',
          component: DocumentSideStreamOverviewComponent,
        },
        {
          path: 'streams/:streamId/logs',
          component: DocumentSideStreamLogsComponent,
        },
        {
          path: 'streams/:streamId/references',
          component: DocumentSideStreamReferencesComponent,
        },
        {
          path: 'log',
          component: DocumentSideLogComponent,
        },
        {
          path: '',
          redirectTo: 'threads',
          pathMatch: 'full',
        },
      ],
    }],
  },
  {
    path: 'versions',
    component: DocumentVersionsComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ':id/content',
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocumentRoutingModule { }
