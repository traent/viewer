import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SnapshotService } from '@viewer/services';
import { emptyIdentityExtractorPaginator } from '@viewer/utils';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-thread-side-log',
  templateUrl: './thread-side-log.component.html',
  styleUrls: ['./thread-side-log.component.scss'],
})
export class ThreadSideLogComponent {

  readonly paginator$ = this.route.params.pipe(
    map(({ id }) => id),
    map((threadId) => emptyIdentityExtractorPaginator((page) =>
      this.snapshotService.getSnapshotCollection({ limit: 10, page, id: threadId }),
      10,
    )),
  );

  constructor(
    private readonly snapshotService: SnapshotService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

}
