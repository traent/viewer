import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UIPaginator } from '@traent/ngx-paginator';
import { ThreadService, DocumentService } from '@viewer/services';
import { map } from 'rxjs';

const THREAD_REFERENCES_LIMIT = 15;

@Component({
  selector: 'app-thread-side-reference',
  templateUrl: './thread-side-reference.component.html',
  styleUrls: ['./thread-side-reference.component.scss'],
})
export class ThreadSideReferenceComponent {

  readonly references$ = this.route.params.pipe(
    map(({ threadId }) =>
      UIPaginator.makePlaceholderPaginator(async (page) => {
          const references = await this.threadService.getThreadReferences({page, threadId, limit: THREAD_REFERENCES_LIMIT});
          return this.documentService.getDocumentSupplierPage(references);
        },
        THREAD_REFERENCES_LIMIT,
      )),
  );

  constructor(
    private readonly documentService: DocumentService,
    private readonly threadService: ThreadService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

}
