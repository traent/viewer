import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SnapshotService } from '@viewer/services';
import { emptyIdentityExtractorPaginator } from '@viewer/utils';
import { map } from 'rxjs';

@Component({
  selector: 'app-document-side-log',
  templateUrl: './document-side-log.component.html',
  styleUrls: ['./document-side-log.component.scss'],
})
export class DocumentSideLogComponent {

  readonly documentId$ = this.route.params.pipe(
    map(({ id }) => id),
  );

  readonly paginator$ = this.documentId$.pipe(
    map((documentId) => emptyIdentityExtractorPaginator((page) =>
      this.snapshotService.getSnapshotCollection({ limit: 10, page, id: documentId }),
      10,
    )),
  );

  constructor(
    private readonly snapshotService: SnapshotService,
    private readonly route: ActivatedRoute,
  ) { }

}
