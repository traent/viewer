import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { ThreadParticipantService } from '@viewer/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-document-side-thread-participants',
  templateUrl: './document-side-thread-participants.component.html',
  styleUrls: ['./document-side-thread-participants.component.scss'],
})
export class DocumentSideThreadParticipantsComponent {
  private readonly threadId$ = this.route.params.pipe(map((params) => params.threadId));

  readonly participants$ = this.threadId$.pipe(
    map((id) => UIPaginator.makePlaceholderPaginator((page) =>
      this.threadParticipantService.getThreadParticipantCollection(id, { page, limit: 10 }),
    )),
  );

  constructor(
    private readonly threadParticipantService: ThreadParticipantService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
