import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isExportedAndDefined } from '@traent/ngx-components';
import { StreamReference } from '@viewer/models';
import { StreamService, DocumentService } from '@viewer/services';
import { referencesByDoc } from '@viewer/utils';
import { map, filter, switchMap } from 'rxjs';

@Component({
  selector: 'app-document-side-stream-references',
  templateUrl: './document-side-stream-references.component.html',
  styleUrls: ['./document-side-stream-references.component.scss'],
})
export class DocumentSideStreamReferencesComponent {

  readonly streamId$ = this.route.params.pipe(
    map(({ streamId }) => streamId),
  );

  readonly stream$ = this.streamId$.pipe(
    switchMap((streamId) => this.streamService.getStream({ id: streamId })),
  );

  readonly references$ = this.streamId$.pipe(
    filter((streamId) => streamId !== undefined),
    switchMap((streamId) => this.streamService.getStreamReferencesCollection({ streamEntryId: streamId, page: 1 })),
    map((references) => references.items.filter((r): r is StreamReference & { documentId: string } => isExportedAndDefined(r.documentId))),
    map((references) => referencesByDoc(references)),
    map((references) => this.documentService.getDocumentSupplierCollection(references)),
  );

  constructor(
    private readonly documentService: DocumentService,
    private readonly streamService: StreamService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

}
