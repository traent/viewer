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
  DescriptionsModule,
  NoValueLabelModule,
  RedactedModule,
  TagModule,
  ThingAvatarComponent,
} from '@traent/ngx-components';

import { ProjectSideOverviewComponent } from './project-side-overview.component';
import { ValidationErrorsDialogComponent } from './validation-errors-dialog/validation-errors-dialog.component';

@NgModule({
  declarations: [
    ProjectSideOverviewComponent,
    ValidationErrorsDialogComponent,
  ],
  imports: [
    ApplyModule,
    AvatarModule,
    CommonModule,
    MatButtonModule,
    DescriptionsModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    NoValueLabelModule,
    RedactedModule,
    TagModule,
    ThingAvatarComponent,
    TranslateModule,
  ],
  exports: [
    ProjectSideOverviewComponent,
    ValidationErrorsDialogComponent,
  ],
})
export class ProjectSideOverviewModule { }
