import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  IdentityModule,
  SkeletonModule,
  SidebarHeaderModule,
  TableModule,
  TabsModule,
  ThreadModule,
  TimeAgoPipeModule,
  RedactedModule,
  NoValueLabelModule,
} from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';
import {
  ResourceReferenceModule,
  ThreadMessagesModule,
  ThreadOverviewModule,
  ThreadListModule,
  ThreadReferencesModule,
  Uint8PipeModule,
  ParticipantListModule,
  SnapshotRendererModule,
} from '@viewer/shared';

import { ThreadMessagesPageComponent } from './thread-messages-page/thread-messages-page.component';
import { ThreadSideLogComponent } from './thread-side-log/thread-side-log.component';
import { ThreadSideOverviewComponent } from './thread-side-overview/thread-side-overview.component';
import { ThreadSideParticipantsComponent } from './thread-side-participants/thread-side-participants.component';
import { ThreadSideReferenceComponent } from './thread-side-reference/thread-side-reference.component';
import { ThreadSidebarComponent } from './thread-sidebar/thread-sidebar.component';
import { ThreadsPageComponent } from './threads-page.component';
import { ThreadsRoutingModule } from './threads-routing.module';

@NgModule({
  declarations: [
    ThreadMessagesPageComponent,
    ThreadSidebarComponent,
    ThreadSideLogComponent,
    ThreadSideOverviewComponent,
    ThreadSideParticipantsComponent,
    ThreadSideReferenceComponent,
    ThreadsPageComponent,
  ],
  imports: [
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    IdentityModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    NgxT3PaginatorModule,
    NoValueLabelModule,
    ParticipantListModule,
    RedactedModule,
    ResourceReferenceModule,
    RouterModule,
    SidebarHeaderModule,
    SkeletonModule,
    SnapshotRendererModule,
    TableModule,
    TabsModule,
    ThreadListModule,
    ThreadMessagesModule,
    ThreadModule,
    ThreadOverviewModule,
    ThreadReferencesModule,
    ThreadsRoutingModule,
    TimeAgoPipeModule.forRoot({}),
    TranslateModule,
    Uint8PipeModule,
  ],
})
export class ThreadsModule { }
