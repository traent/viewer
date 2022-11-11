import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamReference } from '@viewer/models';
import { StreamService, DocumentService } from '@viewer/services';
import { referencesByDoc } from '@viewer/utils';
import { isExportedAndDefined } from '@traent/ngx-components';
import { map, switchMap, filter } from 'rxjs';

@Component({
  selector: 'app-stream-side-reference',
  templateUrl: './stream-side-reference.component.html',
  styleUrls: ['./stream-side-reference.component.scss'],
})
export class StreamSideReferenceComponent {

  readonly streamId$ = this.route.params.pipe(
    map(({id}) => id),
  );

  constructor(
    private readonly documentService: DocumentService,
    private readonly streamService: StreamService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

  readonly references$ = this.streamId$.pipe(
    filter((streamId) => streamId !== undefined),
    switchMap((streamId) => this.streamService.getStreamReferencesCollection({ streamEntryId: streamId, page: 1 })),
    map((references) => references.items.filter((r): r is StreamReference & { documentId: string } => isExportedAndDefined(r.documentId))),
    map((references) => referencesByDoc(references)),
    map((references) => this.documentService.getDocumentSupplierCollection(references)),
  );

}
