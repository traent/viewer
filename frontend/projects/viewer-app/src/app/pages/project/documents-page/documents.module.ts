import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import {
  AcknowledgmentsDialogModule,
  AcksIconModule,
  AcksStatusModule,
  ParticipantIdentityModule,
  RedactableTagModule,
  SnapshotRendererModule,
  Uint8PipeModule,
} from '@viewer/shared';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  EmptyStateModule,
  IdentityModule,
  NoValueLabelModule,
  RedactedModule,
  SidebarHeaderModule,
  TableModule,
  TabsModule,
  TagModule,
  TimeAgoPipeModule,
} from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { DocumentSideLogComponent } from './document-side-log/document-side-log.component';
import { DocumentSideOverviewComponent } from './document-side-overview/document-side-overview.component';
import { DocumentsPageComponent } from './documents-page.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { DocumentSidebarComponent } from './document-sidebar/document-sidebar.component';

@NgModule({
  declarations: [
    DocumentSideLogComponent,
    DocumentSideOverviewComponent,
    DocumentsPageComponent,
    DocumentSidebarComponent,
  ],
  imports: [
    AcknowledgmentsDialogModule,
    AcksIconModule,
    AcksStatusModule,
    ApplyModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    DocumentsRoutingModule,
    EmptyStateModule,
    IdentityModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    NgxT3PaginatorModule,
    NoValueLabelModule,
    ParticipantIdentityModule,
    RedactableTagModule,
    RedactedModule,
    SidebarHeaderModule,
    SnapshotRendererModule,
    TableModule,
    TabsModule,
    TagModule,
    TimeAgoPipeModule.forRoot({}),
    TranslateModule,
    Uint8PipeModule,
  ],
})
export class DocumentsModule { }
