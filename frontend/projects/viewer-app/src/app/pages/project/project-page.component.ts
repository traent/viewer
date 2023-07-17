import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService, RightSidebarManagerService, LedgerAccessorService, StorageService } from '@viewer/services';
import { extractNavigationValuesFromDefaultPage } from '@viewer/utils';
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
      : this.ledgerAccessorService.getBlockLedger().getExportRequest().then((request) => request?.name),
    ),
  );

  readonly showSidebar$ = this.rightSidebarManagerService.showSidebarPreference$;
  readonly defaultPage$ = this.ledgerAccessorService.getBlockLedger()
    .getExportRequest()
    .then((request) => request?.defaultPage);

  readonly canNavigateLedgerSelection = this.storageService.getLedgers().length > 1;

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly projectService: ProjectService,
    private readonly router: Router,
    private readonly storageService: StorageService,
    readonly rightSidebarManagerService: RightSidebarManagerService,
  ) {
    this.rightSidebarManagerService.initStoreKey('project-page-sidebar');
  }

  navigateToDefaultPage(defaultPage: string) {
    const options = extractNavigationValuesFromDefaultPage(defaultPage);
    if (options?.baseUrlWithoutQueryParams) {
      return this.router.navigate([options.baseUrlWithoutQueryParams], { queryParams: options.queryParams, queryParamsHandling: 'merge' });
    }
    return;
  }

  navigateToLedgerSelection() {
    this.ledgerAccessorService.selectLedger(undefined);
    this.router.navigate(['/project/select']);
  }
}
