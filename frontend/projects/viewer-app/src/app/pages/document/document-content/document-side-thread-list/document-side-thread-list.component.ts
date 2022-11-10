import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ThreadCategories } from '@viewer/models';
import { ThreadService } from '@viewer/services';
import { UIPaginator } from '@traent/ngx-paginator';
import { map, BehaviorSubject, combineLatest } from 'rxjs';

const THREAD_ITEMS_LIMIT = 15;

@Component({
  selector: 'app-document-side-thread-list',
  templateUrl: './document-side-thread-list.component.html',
  styleUrls: ['./document-side-thread-list.component.scss'],
})
export class DocumentSideThreadListComponent {

  readonly documentId$ = this.route.params.pipe(
    map(({ id }) => id),
  );

  readonly categorySelection$ = new BehaviorSubject<ThreadCategories>('all');
  get categorySelection(): ThreadCategories {
    return this.categorySelection$.value;
  }
  set categorySelection(value: ThreadCategories) {
    this.categorySelection$.next(value);
  }

  readonly threads$ = combineLatest([
    this.documentId$,
    this.categorySelection$.pipe(
      map((category) => category !== 'all'
        ? category === 'resolved'
        : undefined,
      ),
    ),
  ]).pipe(
    map(([documentId, isResolved])=> UIPaginator.makePlaceholderPaginator((page) =>
      this.threadService.getThreads({ page, isResolved, limit: THREAD_ITEMS_LIMIT, documentId }),
      THREAD_ITEMS_LIMIT,
    )),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly threadService: ThreadService,
  ) { }

  selectThread(thread: any) {
    this.router.navigate([thread.id, 'messages'], { queryParamsHandling: 'preserve', relativeTo: this.route });
  };
}
