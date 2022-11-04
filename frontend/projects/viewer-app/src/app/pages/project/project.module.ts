import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  AcksStatusModule,
  IdentityValidationModule,
  ParticipantIdentityModule,
  RedactableTagModule,
  SnapshotRendererModule,
  Uint8PipeModule,
} from '@viewer/shared';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  AvatarModule,
  CopyToClipboardModule,
  DescriptionsModule,
  GrowingSearchBarModule,
  IconModule,
  IdentityModule,
  NoValueLabelModule,
  RedactedModule,
  RightSidebarModule,
  SearchBarModule,
  SidebarHeaderModule,
  SkeletonModule,
  StreamModule,
  TabsModule,
  TagModule,
  TimeAgoPipeModule,
} from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ProjectPageComponent } from './project-page.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectSideInfoComponent } from './project-side-info/project-side-info.component';
import { ProjectSideLogComponent } from './project-side-log/project-side-log.component';
import { ProjectSideWorkflowComponent } from './project-side-workflow/project-side-workflow.component';
import { ProjectSideComponent } from './project-side/project-side.component';
import { ProjectSideOrganizationsComponent } from './project-side-organizations/project-side-organizations.component';
import { ProjectSideParticipantsComponent } from './project-side-participants/project-side-participants.component';
import { ValidationErrorsDialogComponent } from './validation-errors-dialog/validation-errors-dialog.component';

@NgModule({
  declarations: [
    ProjectPageComponent,
    ProjectSideComponent,
    ProjectSideInfoComponent,
    ProjectSideLogComponent,
    ProjectSideOrganizationsComponent,
    ProjectSideParticipantsComponent,
    ProjectSideWorkflowComponent,
    ValidationErrorsDialogComponent,
  ],
  imports: [
    AcksStatusModule,
    ApplyModule,
    AvatarModule,
    CommonModule,
    CopyToClipboardModule,
    DescriptionsModule,
    GrowingSearchBarModule,
    IconModule,
    IdentityModule,
    IdentityValidationModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    NgxT3PaginatorModule,
    NoValueLabelModule,
    ParticipantIdentityModule,
    ProjectRoutingModule,
    RedactableTagModule,
    RedactedModule,
    RightSidebarModule,
    SearchBarModule,
    SidebarHeaderModule,
    SkeletonModule,
    SnapshotRendererModule,
    StreamModule,
    TabsModule,
    TagModule,
    TimeAgoPipeModule.forRoot({}),
    TranslateModule,
    Uint8PipeModule,
  ],
})
export class ProjectModule { }
