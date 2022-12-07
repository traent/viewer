import { Component, Input } from '@angular/core';
import { SnapshotService } from '@viewer/services';
import { emptyIdentityExtractorPaginator, ProjectLogFilterType, snapshotTypeFromFilter } from '@viewer/utils';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-project-side-log-list',
  templateUrl: './project-side-log-list.component.html',
  styleUrls: ['./project-side-log-list.component.scss'],
})
export class ProjectSideLogListComponent {
  private readonly ledgerId$ = new BehaviorSubject<string | undefined>(undefined);
  get ledgerId() {
    return this.ledgerId$.value;
  }
  @Input() set ledgerId(v: string | undefined) {
    this.ledgerId$.next(v);
  }

  readonly logQuery$ = new BehaviorSubject<string>('');
  get logQuery() {
    return this.logQuery$.value;
  }
  set logQuery(value: string) {
    this.logQuery$.next(value);
  }

  readonly filterType$ = new BehaviorSubject<ProjectLogFilterType>('all');
  get filterType(): ProjectLogFilterType {
    return this.filterType$.value;
  }
  set filterType(value: ProjectLogFilterType) {
    this.filterType$.next(value);
  }

  readonly paginator$ = combineLatest([
    this.ledgerId$,
    this.filterType$,
  ]).pipe(
    map(([ledgerId, filterType]) => emptyIdentityExtractorPaginator(
      (page) => this.snapshotService.getSnapshotCollection({ ledgerId, limit: 10, page, types: snapshotTypeFromFilter(filterType) }),
      10,
    )),
  );

  constructor(private readonly snapshotService: SnapshotService) { }
}
