import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { ThreadCategories } from '@viewer/models';
import { ThreadService } from '@viewer/services';
import { BehaviorSubject } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

const THREAD_ITEMS_LIMIT = 15;

@Component({
  selector: 'app-threads-page',
  templateUrl: './threads-page.component.html',
  styleUrls: ['./threads-page.component.scss'],
})
export class ThreadsPageComponent {

  readonly categorySelection$ = new BehaviorSubject<ThreadCategories>('all');
  get categorySelection(): ThreadCategories {
    return this.categorySelection$.value;
  }
  set categorySelection(value: ThreadCategories) {
    this.categorySelection$.next(value);
  }

  readonly threads$ = this.categorySelection$.pipe(
    map((category) => category !== 'all'
      ? category === 'resolved'
      : undefined,
    ),
    map((isResolved)=> UIPaginator.makePlaceholderPaginator(async (page) =>
      await this.threadService.getThreads({ page, isResolved, limit: THREAD_ITEMS_LIMIT }),
      THREAD_ITEMS_LIMIT,
    )),
  );

  readonly threadIdSelected$ = this.router.events.pipe(
    // note: this is needed in order to make the navigation to work from outside of the threads-page
    // Otherwise, the router would not trigger any event and would not select any thread.
    startWith(undefined),
    map(() => this.route.firstChild?.snapshot.params?.id),
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly threadService: ThreadService,
  ) { }

  selectThread(thread: any) {
    this.router.navigate(['/project', 'threads', {
      outlets: {
        primary: [thread?.id],
        aside: [thread?.id],
      },
    }]);
  };
}
