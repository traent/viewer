import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService, StorageService, RightSidebarManagerService } from '@viewer/services';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project-page.component.html',
  styleUrls: ['./project-page.component.scss'],
  providers: [RightSidebarManagerService],
})
export class ProjectPageComponent {
  readonly title$ = from(this.projectService.getLedgerProject()).pipe(
    switchMap((project) => project?.name
      ? of(project.name)
      : this.storageService.getExportRequest().then((request) => request?.name),
    ),
  );

  readonly showSidebar$ = this.rightSidebarManagerService.showSidebarPreference$;

  readonly defaultPage$ = this.storageService.getExportRequest().then((request) => request?.defaultPage);

  constructor(
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly storageService: StorageService,
    readonly rightSidebarManagerService: RightSidebarManagerService,
  ) {
    this.rightSidebarManagerService.initStoreKey('project-page-sidebar');
  }

  navigateToDefaultPage(defaultPage: string) {
    return this.router.navigateByUrl(defaultPage);
  }
}
