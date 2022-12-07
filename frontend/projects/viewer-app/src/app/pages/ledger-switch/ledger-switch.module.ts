import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApplyModule,
  DescriptionsModule,
  IconModule,
  NoValueLabelModule,
  RedactedModule,
  RightSidebarModule,
  SidebarHeaderModule,
  SkeletonModule,
  TableModule,
  TabsModule,
} from '@traent/ngx-components';
import {
  AcksIconModule,
  CrossProjectReferencesListModule,
  ProjectSideLogListModule,
  ProjectSideOrganizationsListModule,
  ProjectSideOverviewModule,
  ProjectSideParticipantsListModule,
} from '@viewer/shared';

import { ExportSideInfoComponent } from './export-side-info/export-side-info.component';
import {
  LedgerSideCrossProjectReferencesComponent,
} from './ledger-side-cross-project-references/ledger-side-cross-project-references.component';
import { LedgerSideInfoComponent } from './ledger-side-info/ledger-side-info.component';
import { LedgerSideLogComponent } from './ledger-side-log/ledger-side-log.component';
import { LedgerSideOrganizationsComponent } from './ledger-side-organizations/ledger-side-organizations.component';
import { LedgerSideParticipantsComponent } from './ledger-side-participants/ledger-side-participants.component';
import { LedgerSwitchPageComponent } from './ledger-switch-page.component';
import { LedgerSwitchRoutingModule } from './ledger-switch-routing.module';
import { SwitchSidebarComponent } from './switch-sidebar/switch-sidebar.component';

@NgModule({
  declarations: [
    ExportSideInfoComponent,
    LedgerSideCrossProjectReferencesComponent,
    LedgerSideInfoComponent,
    LedgerSideLogComponent,
    LedgerSideOrganizationsComponent,
    LedgerSideParticipantsComponent,
    LedgerSwitchPageComponent,
    SwitchSidebarComponent,
  ],
  imports: [
    AcksIconModule,
    ApplyModule,
    CommonModule,
    CrossProjectReferencesListModule,
    DescriptionsModule,
    IconModule,
    LedgerSwitchRoutingModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    NoValueLabelModule,
    ProjectSideLogListModule,
    ProjectSideOrganizationsListModule,
    ProjectSideOverviewModule,
    ProjectSideParticipantsListModule,
    RedactedModule,
    RightSidebarModule,
    SidebarHeaderModule,
    SkeletonModule,
    TableModule,
    TabsModule,
    TranslateModule,
  ],
})
export class LedgerSwitchModule { }
