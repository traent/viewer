import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { ThreadParticipantService } from '@viewer/services';
import { map } from 'rxjs';

@Component({
  selector: 'app-thread-side-participants',
  templateUrl: './thread-side-participants.component.html',
  styleUrls: ['./thread-side-participants.component.scss'],
})
export class ThreadSideParticipantsComponent {
  private readonly threadId$ = this.route.params.pipe(map((params) => params.id));

  readonly participants$ = this.threadId$.pipe(
    map((threadId) => UIPaginator.makePlaceholderPaginator((page) =>
      this.threadParticipantService.getThreadParticipantCollection(threadId, { page, limit: 10 }),
    )),
  );

  constructor(
    private readonly threadParticipantService: ThreadParticipantService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
