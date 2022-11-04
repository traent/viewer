import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { bindOpenAcknowledgementsDialog } from '@viewer/shared';
import { BehaviorSubject, combineLatest, defer } from 'rxjs';
import { shareReplay, switchMap, tap } from 'rxjs/operators';
import { pageEventDistinct } from '@traent/ngx-components';
import { formatBytesSize } from '@traent/ts-utils';
import { Document } from '@viewer/models';
import { downloadDocument, SortableColumn } from '@viewer/utils';
import { DocumentService, RightSidebarManagerService, AcknowledgementService, TagService } from '@viewer/services';

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
        ackInfo$: defer(() => this.acknowledgementService.getAcknowledgementStatus(document.updatedInBlock.index)),
        tags$: defer(() => this.tagService.getTagEntryCollection({
          page: 1,
          taggedResourceId: document.id,
        }).then((entries) => Promise.all(entries.items.map((entry) => entry.tag())))),
      }));

      return {
        ...collection,
        items,
      };
    }),
    tap(() => this.isLoading = false),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  isLoading = false;

  readonly downloadDocument = downloadDocument;
  readonly formatByteSize = formatBytesSize;

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly dialog: MatDialog,
    private readonly documentService: DocumentService,
    private readonly tagService: TagService,
    readonly rightSidebarManagerService: RightSidebarManagerService,
  ) { }
}
