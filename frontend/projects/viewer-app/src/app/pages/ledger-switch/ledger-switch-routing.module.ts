import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExportSideInfoComponent } from './export-side-info/export-side-info.component';
import {
  LedgerSideCrossProjectReferencesComponent,
} from './ledger-side-cross-project-references/ledger-side-cross-project-references.component';
import { LedgerSideInfoComponent } from './ledger-side-info/ledger-side-info.component';
import { LedgerSideLogComponent } from './ledger-side-log/ledger-side-log.component';
import { LedgerSideOrganizationsComponent } from './ledger-side-organizations/ledger-side-organizations.component';
import { LedgerSideParticipantsComponent } from './ledger-side-participants/ledger-side-participants.component';
import { LedgerSwitchPageComponent } from './ledger-switch-page.component';
import { SwitchSidebarComponent } from './switch-sidebar/switch-sidebar.component';

const routes: Routes = [{
  path: '',
  component: LedgerSwitchPageComponent,
  children: [
    {
      path: '',
      component: SwitchSidebarComponent,
      children: [
        {
          path: '',
          component: ExportSideInfoComponent,
        },
      ],
    },
    {
      path: ':ledgerId',
      component: SwitchSidebarComponent,
      children: [
        {
          path: 'info',
          component: LedgerSideInfoComponent,
        },
        {
          path: 'info/organizations',
          component: LedgerSideOrganizationsComponent,
        },
        {
          path: 'info/participants',
          component: LedgerSideParticipantsComponent,
        },
        {
          path: 'info/linked-projects',
          component: LedgerSideCrossProjectReferencesComponent,
        },
        {
          path: 'log',
          component: LedgerSideLogComponent,
        },
        {
          path: '',
          redirectTo: 'info',
          pathMatch: 'full',
        },
      ],
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LedgerSwitchRoutingModule { }
