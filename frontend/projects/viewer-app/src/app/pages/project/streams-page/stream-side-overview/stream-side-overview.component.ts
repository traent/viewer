import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamService } from '@viewer/services';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-stream-side-overview',
  templateUrl: './stream-side-overview.component.html',
  styleUrls: ['./stream-side-overview.component.scss'],
})
export class StreamSideOverviewComponent {

  readonly stream$ = this.route.params.pipe(
    switchMap(({ id }) => this.streamService.getStream({ id })),
    tap({ error: () => this.router.navigate(['/project']) }),
  );

  readonly streamReferencesCount$ = this.route.params.pipe(
    map(({ id }) => id),
    switchMap((streamId) => this.streamService.getStreamReferencesCollection({ streamEntryId: streamId, page: 1 })),
    map((page) => page.total),
  );

  constructor(
    private readonly streamService: StreamService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) {
  }

  openReferences(referencesCount: number | null) {
    if (!referencesCount) {
      return;
    }
    this.router.navigate(['references'], { queryParamsHandling: 'preserve', relativeTo: this.route });
  }

}
