import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { IdentityModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ProjectSideOrganizationsListComponent } from './project-side-organizations-list.component';
import { IdentityValidationModule } from '../../identity-validation/identity-validation.module';


@NgModule({
  declarations: [ProjectSideOrganizationsListComponent],
  imports: [
    CommonModule,
    IdentityModule,
    IdentityValidationModule,
    NgxT3PaginatorModule,
  ],
  exports: [ProjectSideOrganizationsListComponent],
})
export class ProjectSideOrganizationsListModule { }
