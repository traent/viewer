import { Component } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';

import { TagType } from '../../ledger-objects/models';
import { TagsService } from '../../tags';

@Component({
  selector: 'app-tags-filter-mobile',
  templateUrl: './tags-filter-mobile.component.html',
  styleUrls: ['./tags-filter-mobile.component.scss'],
})
export class TagsFilterMobileComponent {

  readonly activeTagId$ = this.route.queryParams.pipe(
    map(({ tag }) => tag),
  );

  readonly tags$ = this.tagsService.getTags({ type: TagType.Document });

  constructor(
    private readonly bottomSheetRef: MatBottomSheetRef<TagsFilterMobileComponent>,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly tagsService: TagsService,
  ) {
  }

  selectTagHandler(tag: { id: string }) {
    this.bottomSheetRef.dismiss();
    return this.router.navigate([], { relativeTo: this.route, queryParams: { tag: tag.id } });
  }

  clearTagHandler() {
    this.bottomSheetRef.dismiss();
    return this.router.navigate([], { relativeTo: this.route, queryParams: {} });
  }
}
