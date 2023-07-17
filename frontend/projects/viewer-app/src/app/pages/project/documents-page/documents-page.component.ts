import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { isExported, pageEventDistinct } from '@traent/ngx-components';
import { formatBytesSize } from '@traent/ts-utils';
import { Document } from '@viewer/models';
import { DocumentService, RightSidebarManagerService, TagService, LedgerAccessorService } from '@viewer/services';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { downloadDocument, SortableColumn } from '@viewer/utils';
import { BehaviorSubject, combineLatest, defer } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';

const columnNameToSortBy = (columnName: string): SortableColumn<Document> => {
  switch (columnName) {
    case 'name': return 'name';
    case 'size': return 'length';
    case 'last-edit': return 'updatedAt';
    default: return undefined;
  }
};

@Component({
  selector: 'app-documents-page',
  templateUrl: './documents-page.component.html',
  styleUrls: ['./documents-page.component.scss'],
})
export class DocumentsPageComponent {
  readonly openAcknowledgementsDialog = bindOpenAcknowledgementsDialog(this.dialog);
  readonly columns = ['name', 'tags', 'size', 'last-edit'];
  readonly pageEvent$ = new BehaviorSubject({ pageIndex: 0, pageSize: 25 });
  readonly sortEvent$ = new BehaviorSubject<Sort>({ active: '', direction: '' });

  readonly documents$ = combineLatest([
    this.pageEvent$.pipe(pageEventDistinct()),
    this.sortEvent$,
  ]).pipe(
    tap(() => this.isLoading = true),
    switchMap(([pageEvent, sortEvent]) => this.documentService.getDocumentCollection({
      sortOrder: sortEvent.direction || undefined,
      sortBy: columnNameToSortBy(sortEvent.active),
      page: pageEvent.pageIndex + 1,
      limit: pageEvent.pageSize,
    })),
    switchMap(async (collection) => {
      const items = collection.items.map((document) => ({
        data: document,
        ackInfo$: defer(() => this.ledgerAccessorService.getLedger().getAcknowledgementStatus(document.updatedInBlock.index)),
        content$: defer(async () => document.isContentReadable ? this.documentService.getDocumentContent({ document }) : undefined),
        tags$: defer(() => this.tagService.getTagEntryCollection({
          page: 1,
          taggedResourceId: document.id,
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

  readonly documentIdSelected$ = this.route.params.pipe(
    map(({ id }) => id),
    distinctUntilChanged(),
  );

  isLoading = false;

  readonly downloadDocument = downloadDocument;
  readonly formatByteSize = formatBytesSize;

  constructor(
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tagService: TagService,
    readonly rightSidebarManagerService: RightSidebarManagerService,
  ) { }
}
