import { Component } from '@angular/core';
import { SnapshotService } from '@viewer/services';
import { emptyIdentityExtractorPaginator, ProjectLogFilterType, snapshotTypeFromFilter } from '@viewer/utils';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-project-side-log',
  templateUrl: './project-side-log.component.html',
  styleUrls: ['./project-side-log.component.scss'],
})
export class ProjectSideLogComponent {

  readonly logQuery$ = new BehaviorSubject<string>('');
  set logQuery(value: string) {
    this.logQuery$.next(value);
  }
  get logQuery() {
    return this.logQuery$.value;
  }

  readonly filterType$ = new BehaviorSubject<ProjectLogFilterType>('all');
  get filterType(): ProjectLogFilterType {
    return this.filterType$.value;
  }
  set filterType(value: ProjectLogFilterType) {
    this.filterType$.next(value);
  }

  readonly paginator$ = this.filterType$.pipe(
    map((filterType) => emptyIdentityExtractorPaginator(
      (page) => this.snapshotService.getSnapshotCollection({ limit: 10, page, types: snapshotTypeFromFilter(filterType)}),
      10,
    )),
  );

  constructor(private readonly snapshotService: SnapshotService) { }

}
