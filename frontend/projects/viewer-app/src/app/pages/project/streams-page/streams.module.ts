import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  EmptyStateModule,
  IconModule,
  IdentityModule,
  NoValueLabelModule,
  RedactedModule,
  SidebarHeaderModule,
  SkeletonModule,
  StreamModule as NgxT3StreamModule,
  TableModule,
  TabsModule,
  TagModule,
} from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';
import {
  AcknowledgmentsDialogModule,
  AcksIconModule,
  RedactableTagModule,
  ResourceReferenceModule,
  StreamOverviewModule,
  StreamReferencesModule,
  StreamSnapshotDetailModule,
  Uint8PipeModule,
} from '@viewer/shared';

import { StreamSideLogComponent } from './stream-side-log/stream-side-log.component';
import { StreamSideOverviewComponent } from './stream-side-overview/stream-side-overview.component';
import { StreamSideReferenceComponent } from './stream-side-reference/stream-side-reference.component';
import { StreamSidebarComponent } from './stream-sidebar/stream-sidebar.component';
import { StreamsPageComponent } from './streams-page.component';
import { StreamRoutingModule } from './streams-routing.module';

@NgModule({
  declarations: [
    StreamsPageComponent,
    StreamSidebarComponent,
    StreamSideLogComponent,
    StreamSideOverviewComponent,
    StreamSideReferenceComponent,
  ],
  imports: [
    AcknowledgmentsDialogModule,
    AcksIconModule,
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    EmptyStateModule,
    IconModule,
    IdentityModule,
    MatIconModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    NgxT3PaginatorModule,
    NgxT3StreamModule,
    NoValueLabelModule,
    RedactableTagModule,
    RedactedModule,
    ResourceReferenceModule,
    SidebarHeaderModule,
    SkeletonModule,
    StreamOverviewModule,
    StreamReferencesModule,
    StreamRoutingModule,
    StreamSnapshotDetailModule,
    TableModule,
    TabsModule,
    TagModule,
    TranslateModule,
    Uint8PipeModule,
  ],
})
export class StreamModule { }
