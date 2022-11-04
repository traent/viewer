import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ServiceWorkerService } from '@viewer/services';
import { combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-view-doc',
  templateUrl: './view-doc.component.html',
  styleUrls: ['./view-doc.component.scss'],
})
export class ViewDocComponent {

  readonly url$ = combineLatest([
    this.serviceWorkerService.clientId$,
    this.route.params,
    this.route.queryParams,
  ]).pipe(
    map(([clientId, { ledgerId, id }, { page }]) => `/virtual/${clientId}/doc/${ledgerId}/${id}${page ? `/${page}`  : ''}`),
    map((url) => this.sanitizer.bypassSecurityTrustResourceUrl(url)),
  );

  loaded = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly sanitizer: DomSanitizer,
    private readonly serviceWorkerService: ServiceWorkerService,
  ) {
  }

  loadHandler(event: any) {
    if (event.srcElement.src) {
      this.loaded = true;
    }
  }
}
