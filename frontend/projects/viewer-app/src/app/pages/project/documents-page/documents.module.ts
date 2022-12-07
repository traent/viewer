import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  CopyToClipboardModule,
  DescriptionsModule,
  EmptyStateModule,
  IdentityModule,
  NoValueLabelModule,
  PreventClickPropagationModule,
  RedactedModule,
  SidebarHeaderModule,
  TableModule,
  TabsModule,
  TagModule,
  TimeAgoPipeModule,
} from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';
import {
  AcknowledgmentsDialogModule,
  AcksIconModule,
  AcksStatusModule,
  ParticipantIdentityModule,
  RedactableTagModule,
  SnapshotRendererModule,
  Uint8PipeModule,
} from '@viewer/shared';

import { DocumentSideLogComponent } from './document-side-log/document-side-log.component';
import { DocumentSideOverviewComponent } from './document-side-overview/document-side-overview.component';
import { DocumentSidebarComponent } from './document-sidebar/document-sidebar.component';
import { DocumentsPageComponent } from './documents-page.component';
import { DocumentsRoutingModule } from './documents-routing.module';

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
    PreventClickPropagationModule,
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
