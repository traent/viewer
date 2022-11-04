import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { ThreadParticipantService, ThreadService } from '@viewer/services';
import { map, shareReplay, switchMap } from 'rxjs';

@Component({
  selector: 'app-thread-side-overview',
  templateUrl: './thread-side-overview.component.html',
  styleUrls: ['./thread-side-overview.component.scss'],
})
export class ThreadSideOverviewComponent {

  readonly thread$ = this.route.params.pipe(
    map((params) => params.id),
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
    readonly route: ActivatedRoute,
    readonly router: Router,
    readonly threadService: ThreadService,
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
