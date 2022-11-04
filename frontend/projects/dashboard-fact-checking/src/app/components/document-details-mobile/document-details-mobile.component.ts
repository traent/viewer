import { Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { isRedacted } from '@traent/ngx-components';
import { combineLatest, filter, from, of, switchMap } from 'rxjs';
import { formatBytesSize, isNotNullOrUndefined } from '@traent/ts-utils';

import { Document } from '../../documents';
import { ParticipantsService } from '../../participants';
import { LedgerProjectParticipant, WorkflowParticipant } from '../../participants/participant';
import { TagsService } from '../../tags';

@Component({
  selector: 'app-document-details-mobile',
  templateUrl: './document-details-mobile.component.html',
  styleUrls: ['./document-details-mobile.component.scss'],
})
export class DocumentDetailsMobileComponent {

  readonly participant$ = of(this.data.document).pipe(
    isNotNullOrUndefined(),
    switchMap(async (document) => !isRedacted(document.updaterId)
      ? this.participantsService.getParticipant(document.updaterId)
      : undefined,
    ),
    filter((i): i is LedgerProjectParticipant => typeof i !== typeof WorkflowParticipant),
  );

  readonly documentTags$ = from(this.tagsService.getTagEntries({
    taggedResourceId: this.data.document.id,
  })).pipe(
    switchMap((items) => items.length > 0
      ? combineLatest(items.map((tagEntry) => tagEntry.tag()))
      : of([]),
    ),
  );

  readonly formatBytesSize = formatBytesSize;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) readonly data: {
      document: Document;
    },
    private readonly participantsService: ParticipantsService,
    private readonly tagsService: TagsService,
  ) {
  }
}
