import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { isExported } from '@traent/ngx-components';
import { StreamEntry } from '@viewer/models';
import { StreamService, RightSidebarManagerService, TagService, LedgerAccessorService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { SortableColumn } from '@viewer/utils';
import { getStreamTypeIcon, printableStreamTypes } from '@viewer/utils';
import {
  map,
  tap,
  filter,
  combineLatest,
  BehaviorSubject,
  distinctUntilChanged,
  switchMap,
  debounceTime,
  defer,
} from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const columnNameToSortBy = (columnName: string): SortableColumn<StreamEntry> => {
  switch (columnName) {
    case 'name': return 'name';
    case 'machine-name': return 'machineName';
    case 'value': return 'value';
    default: return undefined;
  }
};

@Component({
  selector: 'app-streams-page',
  templateUrl: './streams-page.component.html',
  styleUrls: ['./streams-page.component.scss'],
})
export class StreamsPageComponent {
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);

  readonly type$ = this.route.queryParams.pipe(
    map((queryParams) => queryParams['type']),
    tap((type) => {
      if (!type) {
        this.router.navigate([], { queryParams: { type: 'all' }, queryParamsHandling: 'merge', replaceUrl: true });
      }
    }),
    filter((type) => !!type),
    distinctUntilChanged(),
    tap(() => {
      if (this.pageEvent.pageIndex !== 0) {
        this.pageEvent$.next({ pageIndex: 0, pageSize: this.pageEvent.pageSize });
      }
    }),
  );

  readonly pageEvent$ = new BehaviorSubject({ pageIndex: 0, pageSize: 25 });
  get pageEvent() {
    return this.pageEvent$.value;
  }

  readonly sortEvent$ = new BehaviorSubject<Sort>({ active: '', direction: '' });

  /**
   * The debounceTime(0) is required to avoid events duplication when more than one sources emit in an atomic operation.
   * Ex. select type with a page reset.
   */
  readonly stream$ = combineLatest([
    this.type$,
    this.pageEvent$,
    this.sortEvent$,
  ]).pipe(
    debounceTime(0),
    tap(() => this.isLoading = true),
    switchMap(([type, pageEvent, sortEvent]) => this.streamService.getStreamCollection({
      uiType: type !== 'all' ? type : undefined,
      page: pageEvent.pageIndex + 1,
      limit: pageEvent.pageSize,
      sortBy: columnNameToSortBy(sortEvent.active),
      sortOrder: sortEvent.direction || undefined,
    })),
    switchMap(async (collection) => {
      const items = collection.items.map((stream) => ({
        data: stream,
        ackInfo$: defer(() => this.ledgerAccessorService.getLedger().getAcknowledgementStatus(stream.updatedInBlock.index)),
        classes$: defer(() => this.tagService.getTagEntryCollection({
          page: 1,
          taggedResourceId: stream.id,
        }).then((entries) => Promise.all(entries.items.map((te) => te.tagId)
          .filter(isExported)
          .map((tagId) => this.tagService.getTag({ id: tagId }))),
        )),
      }));

      return {
        ...collection,
        items,
      };
    }),
    tap(() => this.isLoading = false),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly streamIdSelected$ = this.route.params.pipe(
    map(({ id }) => id),
    distinctUntilChanged(),
  );

  isLoading = false;

  readonly getStreamTypeIcon = getStreamTypeIcon;
  readonly printableStreamTypes = printableStreamTypes;

  constructor(
    private readonly dialog: MatDialog,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly streamService: StreamService,
    private readonly tagService: TagService,
    readonly rightSidebarManagerService: RightSidebarManagerService,
  ) { }
}
