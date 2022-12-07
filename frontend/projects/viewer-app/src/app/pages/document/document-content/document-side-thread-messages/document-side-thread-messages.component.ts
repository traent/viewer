import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { ProjectParticipantService, ThreadService } from '@viewer/services';
import { map, filter, switchMap, shareReplay } from 'rxjs';

const THREAD_MESSAGES_LIMIT = 15;

@Component({
  selector: 'app-document-side-thread-messages',
  templateUrl: './document-side-thread-messages.component.html',
  styleUrls: ['./document-side-thread-messages.component.scss'],
})
export class DocumentSideThreadMessagesComponent {

  readonly threadSelected$ = this.route.params.pipe(
    map((params) => params.threadId),
    // FIXME: this should be replaced with `isNullOrUndefined` when the `rxjs` versions will be compatible
    filter((id): id is string => id !== undefined && id !== null),
    switchMap((threadId) => this.threadService.getThread({ id: threadId })),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly threadMessages$ = this.threadSelected$.pipe(
    map((thread) => UIPaginator.makePlaceholderPaginator((page) =>
      this.threadService.getThreadMessages({ threadId: thread.id, page, limit: THREAD_MESSAGES_LIMIT, sortOrder: 'desc' }),
      THREAD_MESSAGES_LIMIT,
    )),
  );

  constructor(
    private readonly projectParticipantService: ProjectParticipantService,
    private readonly threadService: ThreadService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

}
