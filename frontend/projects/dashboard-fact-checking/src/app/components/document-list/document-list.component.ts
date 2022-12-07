import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInTopBottomAndOutAnimation } from '@traent/ngx-components';
import { defer, map, switchMap } from 'rxjs';

import { AcknowledgmentService } from '../../acknowledgments';
import { DocumentsService } from '../../documents/documents.service';
import { TagType } from '../../ledger-objects/models';
import { TagsService } from '../../tags';
import { TagsFilterMobileComponent } from '../tags-filter-mobile/tags-filter-mobile.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss'],
  animations: [fadeInTopBottomAndOutAnimation],
})
export class DocumentListComponent {

  @Output() readonly clickDocument = new EventEmitter<any>();

  readonly tags$ = this.tagsService.getTags({ type: TagType.Document });

  readonly activeTagId$ = this.route.queryParams.pipe(
    map(({ tag }) => tag),
  );

  readonly activeTag$ = this.activeTagId$.pipe(
    switchMap((id) => this.tagsService.getTag(id)),
  );

  readonly documents$ = this.activeTagId$.pipe(
    switchMap((tagId) => this.documentsService.getDocumentCollection({ tagId, page: 1, limit: 100 })),
    map(({ items }) => items),
    switchMap(async (items) => {
      const extendedItems = items.map((document) => ({
        data: document,
        ackInfo$: defer(() => this.acknowledgementService.getAcknowledgementStatus(document.updatedInBlock.index)),
        tags$: defer(async () => {
          const entries = await this.tagsService.getTagEntryPage({
            page: 1,
            taggedResourceId: document.id,
          });
          return Promise.all(entries.items.map((entry) => entry.tag()));
        }),
      }));

      return extendedItems;
    }),
  );

  readonly tooltipPosition: Partial<ConnectedPosition> = {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: -10,
    offsetY: 0,
  };

  constructor(
    private readonly acknowledgementService: AcknowledgmentService,
    private readonly bottomSheet: MatBottomSheet,
    private readonly documentsService: DocumentsService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tagsService: TagsService,
  ) {
  }

  showTagsFilterHandler() {
    this.bottomSheet.open(TagsFilterMobileComponent);
  }

  onApplyHandler(id: string) {
    return this.router.navigate([], { relativeTo: this.route, queryParams: { tag: id } });
  }

  onResetHandler() {
    return this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }
}
