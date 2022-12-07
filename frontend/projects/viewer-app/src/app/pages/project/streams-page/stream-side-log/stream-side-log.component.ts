import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { SnapshotService, STREAM_LABEL } from '@viewer/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stream-side-log',
  templateUrl: './stream-side-log.component.html',
  styleUrls: ['./stream-side-log.component.scss'],
})
export class StreamSideLogComponent {

  readonly paginator$ = this.route.params.pipe(
    map(({ id }) => id),
    map((streamId) => UIPaginator.makePlaceholderPaginator((page) =>
      this.snapshotService.getSnapshotCollection({ limit: 10, page, id: streamId }), 10,
    )),
  );

  readonly STREAM_LABEL = STREAM_LABEL;

  constructor(
    private readonly snapshotService: SnapshotService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }
}
