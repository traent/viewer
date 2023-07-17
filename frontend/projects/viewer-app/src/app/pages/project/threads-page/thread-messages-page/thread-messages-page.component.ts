import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { ProjectParticipantService, ThreadService } from '@viewer/services';
import { filter, map, shareReplay, switchMap } from 'rxjs';

const THREAD_MESSAGES_LIMIT = 15;

@Component({
  selector: 'app-thread-messages-page',
  templateUrl: './thread-messages-page.component.html',
  styleUrls: ['./thread-messages-page.component.scss'],
})
export class ThreadMessagesPageComponent {

  readonly threadSelected$ = this.route.params.pipe(
    map((params) => params.id),
    // FIXME: this should be replaced with `isNullOrUndefined` when the `rxjs` versions will be compatible
    filter((id): id is string => id !== undefined && id !== null),
    switchMap((threadId) => this.threadService.getThread({ id: threadId })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly threadMessages$ = this.threadSelected$.pipe(
    map((thread) => UIPaginator.makePlaceholderPaginator(async (page) =>
      await this.threadService.getThreadMessages({ threadId: thread.id, page, limit: THREAD_MESSAGES_LIMIT, sortOrder: 'desc' }),
      THREAD_MESSAGES_LIMIT,
    )),
  );

  constructor(
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly route: ActivatedRoute,
    private readonly threadService: ThreadService,
  ) { }

}
