import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { NgxT3SpinnerModule } from '@traent/ngx-spinner';
import {
  AcksStatusModule,
  CrossProjectReferencesListModule,
  IdentityValidationModule,
  ParticipantIdentityModule,
  ProjectSideLogListModule,
  ProjectSideOrganizationsListModule,
  ProjectSideOverviewModule,
  ProjectSideParticipantsListModule,
  RedactableTagModule,
  SnapshotRendererModule,
  Uint8PipeModule,
} from '@viewer/shared';

import { ProjectPageComponent } from './project-page.component';
import { ProjectRoutingModule } from './project-routing.module';
import { ProjectSideComponent } from './project-side/project-side.component';
import {
  ProjectSideCrossProjectReferencesComponent,
} from './project-side-cross-project-references/project-side-cross-project-references.component';
import { ProjectSideInfoComponent } from './project-side-info/project-side-info.component';
import { ProjectSideOrganizationsComponent } from './project-side-organizations/project-side-organizations.component';
import { ProjectSideParticipantsComponent } from './project-side-participants/project-side-participants.component';
import { ProjectSideWorkflowComponent } from './project-side-workflow/project-side-workflow.component';
import { UiRefreshPageComponent } from '../ui-refresh-page/ui-refresh-page.component';

@NgModule({
  declarations: [
    ProjectPageComponent,
    ProjectSideComponent,
    ProjectSideCrossProjectReferencesComponent,
    ProjectSideInfoComponent,
    ProjectSideOrganizationsComponent,
    ProjectSideParticipantsComponent,
    ProjectSideWorkflowComponent,
    UiRefreshPageComponent,
  ],
  imports: [
    AcksStatusModule,
    ApplyModule,
    AvatarModule,
    CommonModule,
    CopyToClipboardModule,
    CrossProjectReferencesListModule,
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
    NgxT3SpinnerModule,
    NoValueLabelModule,
    ParticipantIdentityModule,
    ProjectRoutingModule,
    ProjectSideLogListModule,
    ProjectSideOrganizationsListModule,
    ProjectSideOverviewModule,
    ProjectSideParticipantsListModule,
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
