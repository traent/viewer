import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamService } from '@viewer/services';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-document-side-stream-overview',
  templateUrl: './document-side-stream-overview.component.html',
  styleUrls: ['./document-side-stream-overview.component.scss'],
})
export class DocumentSideStreamOverviewComponent {

  readonly stream$ = this.route.params.pipe(
    switchMap(({ streamId }) => this.streamService.getStream(streamId)),
  );

  readonly streamReferencesCount$ = this.route.params.pipe(
    switchMap(({ streamId }) => this.streamService.getStreamReferencesCollection({ streamEntryId: streamId, page: 1, limit: 0 })),
    map((page) => page.total),
  );

  constructor(
    private readonly streamService: StreamService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

  openReferences(referencesCount: number | null) {
    if (!referencesCount) {
      return;
    }
    this.router.navigate(['references'], { queryParamsHandling: 'preserve', relativeTo: this.route });
  }

}
