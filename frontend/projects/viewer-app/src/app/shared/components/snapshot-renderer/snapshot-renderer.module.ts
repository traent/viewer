import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  AvatarModule,
  EscapeHtmlModule,
  PointerInnerClickModule,
  SafeHtmlModule,
  SkeletonModule,
} from '@traent/ngx-components';

import {  SnapshotRendererComponent} from './snapshot-renderer.component';
import { AcksIconModule } from '../acks-icon/acks-icon.module';
import { DocumentLogItemComponent } from './document-log-item/document-log-item.component';
import { ParticipantLogItemComponent } from './participant-log-item/participant-log-item.component';
import { ProjectLogItemComponent } from './project-log-item/project-log-item.component';
import { TagLogItemComponent } from './tag-log-item/tag-log-item.component';
import { StreamEntryLogItemComponent } from './stream-entry-log-item/stream-entry-log-item.component';
import { StreamReferenceLogItemComponent } from './stream-reference-log-item/stream-reference-log-item.component';
import { TagEntryLogItemComponent } from './tag-entry-log-item/tag-entry-log-item.component';
import { ThreadLogItemComponent } from './thread-log-item/thread-log-item.component';
import { ThreadMessageLogItemComponent } from './thread-message-log-item/thread-message-log-item.component';
import { ThreadReferenceLogItemComponent } from './thread-reference-log-item/thread-reference-log-item.component';
import { WorkflowLogItemComponent } from './workflow-log-item/workflow-log-item.component';
import { ImageIconModule } from '../image-icon/image-icon.module';
import { DocumentLogDialogModule } from '../document-log-dialog/document-log-dialog.module';
import { ProjectLogDialogModule } from '../project-log-dialog/project-log-dialog.module';
import { StreamLogDialogModule } from '../stream-log-dialog/stream-log-dialog.module';
import { ThreadLogDialogModule } from '../thread-log-dialog/thread-log-dialog.module';

@NgModule({
  declarations: [
    DocumentLogItemComponent,
    ParticipantLogItemComponent,
    ProjectLogItemComponent,
    SnapshotRendererComponent,
    StreamEntryLogItemComponent,
    StreamReferenceLogItemComponent,
    TagEntryLogItemComponent,
    TagLogItemComponent,
    ThreadLogItemComponent,
    ThreadMessageLogItemComponent,
    ThreadReferenceLogItemComponent,
    WorkflowLogItemComponent,
  ],
  imports: [
    AcksIconModule,
    ApplyModule,
    AvatarModule,
    CommonModule,
    DocumentLogDialogModule,
    EscapeHtmlModule,
    ImageIconModule,
    PointerInnerClickModule,
    ProjectLogDialogModule,
    SafeHtmlModule,
    SkeletonModule,
    StreamLogDialogModule,
    ThreadLogDialogModule,
    TranslateModule,
  ],
  exports: [
    SnapshotRendererComponent,
  ],
})
export class SnapshotRendererModule { }
