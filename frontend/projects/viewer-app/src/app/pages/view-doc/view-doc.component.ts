import { Component, NgZone } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentContentUrlService } from '@viewer/services';
import { combineLatest, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-view-doc',
  templateUrl: './view-doc.component.html',
  styleUrls: ['./view-doc.component.scss'],
})
export class ViewDocComponent {

  readonly url$ = combineLatest([
    this.route.params,
    this.route.queryParams,
  ]).pipe(
    switchMap(([{ ledgerId, id }, { page }]) => this.documentUrlService.getDocumentContentUrl({
      ledgerId,
      id,
      subResource: page,
    })),
    map((url) => this.sanitizer.bypassSecurityTrustResourceUrl(url)),
  );

  loaded = false;

  constructor(
    private readonly documentUrlService: DocumentContentUrlService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly zone: NgZone,
  ) {
    const explore = () => this.zone.run(
      async () => {
        await this.router.navigate(['/explorer']);
        window['explore'] = undefined;
      },
    );

    window['explore'] = () => explore();

    // eslint-disable-next-line no-console
    console.info(
      '%cInvoke `explore()` to navigate to Ledger Explorer page`',
      'color:#89A4F3',
    );
  }

  loadHandler(event: any) {
    if (event.srcElement.src) {
      this.loaded = true;
    }
  }
}
