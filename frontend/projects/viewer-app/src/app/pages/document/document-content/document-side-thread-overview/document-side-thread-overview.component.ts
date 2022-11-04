import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThreadParticipantService, ThreadService } from '@viewer/services';
import { map, switchMap, shareReplay } from 'rxjs';

@Component({
  selector: 'app-document-side-thread-overview',
  templateUrl: './document-side-thread-overview.component.html',
  styleUrls: ['./document-side-thread-overview.component.scss'],
})
export class DocumentSideThreadOverviewComponent {

  readonly thread$ = this.route.params.pipe(
    map((params) => params.threadId),
    switchMap((threadId) => this.threadService.getThread(threadId)),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly referencesCount$ = this.thread$.pipe(
    switchMap((thread) => this.threadService.getThreadReferences({ threadId: thread.id, page: 1, limit: 0 })),
    map((threadPage) => threadPage.total),
  );

  readonly participantsCount$ = this.thread$.pipe(
    switchMap(({ id }) => this.threadParticipantService.getThreadParticipantCollection(id)),
    map((page) => page.total),
  );

  constructor(
    private readonly threadParticipantService: ThreadParticipantService,
    private readonly threadService: ThreadService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

  openReferences(referencesCount: number | null) {
    if (!referencesCount) {
      return;
    }
    this.router.navigate(['references'], { relativeTo: this.route });
  }

  openParticipants(participantCount: number | null) {
    if (!participantCount) {
      return;
    }
    this.router.navigate(['participants'], { relativeTo: this.route });
  }

}
