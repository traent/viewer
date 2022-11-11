import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  AcknowledgmentsDialogModule,
  AcksIconModule,
  AcksStatusModule,
  ParticipantAvatarGroupModule,
  ParticipantIdentityModule,
  ParticipantListModule,
  SnapshotRendererModule,
  StreamItemModule,
  StreamListModule,
  StreamOverviewModule,
  StreamReferencesModule,
  ThreadListModule,
  ThreadMessagesModule,
  ThreadOverviewModule,
  ThreadReferencesModule,
  Uint8PipeModule,
} from '@viewer/shared';
import {
  ApplyModule,
  AvatarModule,
  ClickToCopyModule,
  CopyToClipboardModule,
  DocumentViewerModule,
  IdentityModule,
  RedactedModule,
  RightSidebarModule,
  SidebarHeaderModule,
  SkeletonModule,
  StreamModule,
  TabsModule,
  TagModule,
  TimeAgoPipeModule,
  WithSidebarModule,
} from '@traent/ngx-components';
import { NgxT3SpinnerModule } from '@traent/ngx-spinner';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';
import { GlobalWorkerOptions } from 'pdfjs-dist';

import { FormViewerComponent } from './document-content/form-viewer/form-viewer.component';
import { DocumentRoutingModule } from './document-routing.module';
import {
  FormItemFillerWrapperComponent,
} from './document-content/form-viewer/form-item-filler-wrapper/form-item-filler-wrapper.component';
import { DocumentComponent } from './document.component';
import { DocumentVersionsComponent } from './document-versions/document-versions.component';
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
import { DocumentSideThreadListComponent } from './document-content/document-side-thread-list/document-side-thread-list.component';
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

GlobalWorkerOptions.workerSrc = './pdfjs-dist/pdf.worker.min.js';

@NgModule({
  declarations: [
    DocumentComponent,
    DocumentContentComponent,
    DocumentSideAnchorsListComponent,
    DocumentSideLogComponent,
    DocumentSideStreamListComponent,
    DocumentSideStreamLogsComponent,
    DocumentSideStreamOverviewComponent,
    DocumentSideStreamReferencesComponent,
    DocumentSideThreadListComponent,
    DocumentSideThreadMessageOverviewComponent,
    DocumentSideThreadMessagesComponent,
    DocumentSideThreadOverviewComponent,
    DocumentSideThreadParticipantsComponent,
    DocumentSideThreadReferencesComponent,
    DocumentVersionsComponent,
    FormItemFillerWrapperComponent,
    FormViewerComponent,
  ],
  imports: [
    AcknowledgmentsDialogModule,
    AcksIconModule,
    AcksStatusModule,
    ApplyModule,
    AvatarModule,
    ClickToCopyModule,
    CommonModule,
    CopyToClipboardModule,
    DocumentRoutingModule,
    DocumentViewerModule,
    FormsModule,
    ReactiveFormsModule,
    IdentityModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatTooltipModule,
    NgxT3PaginatorModule,
    NgxT3SpinnerModule,
    ParticipantAvatarGroupModule,
    ParticipantIdentityModule,
    ParticipantListModule,
    ReactiveFormsModule,
    RedactedModule,
    RedactedModule,
    RightSidebarModule,
    SidebarHeaderModule,
    SkeletonModule,
    SnapshotRendererModule,
    StreamItemModule,
    StreamListModule,
    StreamModule,
    StreamOverviewModule,
    StreamReferencesModule,
    TabsModule,
    TagModule,
    ThreadListModule,
    ThreadMessagesModule,
    ThreadOverviewModule,
    ThreadReferencesModule,
    TimeAgoPipeModule.forRoot({}),
    TranslateModule,
    Uint8PipeModule,
    WithSidebarModule,
  ],
})
export class DocumentModule { }
