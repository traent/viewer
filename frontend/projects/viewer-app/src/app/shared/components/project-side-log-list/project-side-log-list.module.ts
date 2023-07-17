import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { GrowingSearchBarModule, TabsModule } from '@traent/ngx-components';
import { NgxT3PaginatorModule } from '@traent/ngx-paginator';

import { ProjectSideLogListComponent } from './project-side-log-list.component';
import { SnapshotRendererModule } from '../snapshot-renderer/snapshot-renderer.module';

@NgModule({
  declarations: [ProjectSideLogListComponent],
  imports: [
    CommonModule,
    GrowingSearchBarModule,
    MatIconModule,
    MatTooltipModule,
    TabsModule,
    TranslateModule,
    NgxT3PaginatorModule,
    SnapshotRendererModule,
  ],
  exports: [ProjectSideLogListComponent],
})
export class ProjectSideLogListModule { }
