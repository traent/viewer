import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { StreamEntry } from '@viewer/models';
import { StreamService } from '@viewer/services';
import { map, BehaviorSubject, combineLatest } from 'rxjs';

const STREAM_ITEMS_LIMIT = 15;

@Component({
  selector: 'app-document-side-stream-list',
  templateUrl: './document-side-stream-list.component.html',
  styleUrls: ['./document-side-stream-list.component.scss'],
})
export class DocumentSideStreamListComponent {

  readonly documentId$ = this.route.params.pipe(
    map(({ id }) => id),
  );

  readonly query$ = new BehaviorSubject<string>('');
  get query(): string {
    return this.query$.value;
  }
  set query(value: string) {
    this.query$.next(value);
  }

  readonly streams$ = combineLatest([
    this.documentId$,
    this.query$,
  ]).pipe(
    map(([documentId]) => UIPaginator.makePlaceholderPaginator((page) =>
      this.streamService.getStreamCollection({ documentId, page, limit: STREAM_ITEMS_LIMIT }),
      STREAM_ITEMS_LIMIT,
    )),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly streamService: StreamService,
  ) { }

  openStream(stream: StreamEntry) {
    this.router.navigate([stream.id], { relativeTo: this.route });
  }
}
