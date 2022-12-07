import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { combineLatest, from, map, switchMap } from 'rxjs';
import { isNotNullOrUndefined } from '@traent/ts-utils';

import { ShareLinkMobileComponent } from './components/share-link-mobile/share-link-mobile.component';
import { ContainerApiService } from './container-api';
import { DocumentsService } from './documents';
import { ParticipantsService } from './participants';
import { LedgerProjectParticipant, WorkflowParticipant } from './participants/participant';
import { ProjectService } from './project';
import { StreamsService } from './streams';
import { UiWorkflowService, UIWorkflowState, WorkflowService } from './workflow';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isSidebarOpen = true;

  readonly project$ = this.projectService.getProject();

  readonly workflow$ = from(this.workflowService.getWorkflow());
  readonly uiWorkflowStates$ = from(this.uiWorkflowService.getUiStates());

  readonly uiLastState$ = combineLatest([
    this.workflow$,
    this.uiWorkflowStates$,
  ]).pipe(
    map(([workflow, uiStates]) => uiStates.find((s) => s.stateId === workflow?.lastState)),
    isNotNullOrUndefined(),
  );

  readonly participants$ = from(this.participantsService.getParticipantsPage()).pipe(
    map((page) => page.items),
  );

  readonly participantPaginator = UIPaginator.makePlaceholderPaginator(async (page) => {
    const p = await this.participantsService.getParticipantsPage({ page, limit: 10 });
    const items = p.items.filter((i): i is LedgerProjectParticipant => typeof i !== typeof WorkflowParticipant);
    return {
      ...p,
      items,
    };
  }, 4);

  readonly authors$ = from(this.uiWorkflowService.getWorkflowMetadata()).pipe(
    switchMap(({ view }) => this.participantsService.getParticipantsPage({ tagId: view?.journalistTagId, page: 1, limit: 100 })),
    map(({ items }) => items.filter((i): i is LedgerProjectParticipant => typeof i !== typeof WorkflowParticipant)),
  );

  readonly documentDetails$ = this.route.queryParams.pipe(
    map(({ docDetails }) => docDetails),
  );

  readonly mainArticleUrl$ = this.streamsService.getStreamByMachineName('X-wordpress-news-url').then((s) => s?.value);
  readonly mainArticleUpdateAt$ = this.streamsService.getStreamByMachineName('X-wordpress-news-url').then((s) => s?.updatedAt);

  readonly mainDocCreatedAt$ = this.documentsService.getDocumentOrDefault().then((d) => d?.createdAt);

  constructor(
    private readonly bottomSheet: MatBottomSheet,
    private readonly breakpointObserver: BreakpointObserver,
    private readonly containerApiService: ContainerApiService,
    private readonly documentsService: DocumentsService,
    private readonly participantsService: ParticipantsService,
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly streamsService: StreamsService,
    private readonly uiWorkflowService: UiWorkflowService,
    private readonly workflowService: WorkflowService,
  ) {
    this.breakpointObserver
      .observe(['(min-width: 1550px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isSidebarOpen = true;
        } else {
          this.isSidebarOpen = false;
        }
      });
  }

  showShareLinkHandler() {
    this.bottomSheet.open(ShareLinkMobileComponent);
  }

  showStateHandler(uiState: UIWorkflowState | undefined) {
    if (uiState) {
      return this.router.navigate([], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams: { tag: uiState.configs.tag } });
    } else {
      return this.router.navigate([], { relativeTo: this.route, queryParamsHandling: 'merge', queryParams: { tag: undefined } });
    }
  }

  changeDocumentContentHandler(document: { id: string }) {
    return this.router.navigate(['/documents', document.id], { relativeTo: this.route, queryParamsHandling: 'preserve' });
  }

  navigateToViewerHandler() {
    return this.containerApiService.navigateByUrl('/project/documents');
  }
}
