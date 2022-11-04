import { Component } from '@angular/core';
import { trackById } from '@traent/ts-utils';
import { switchMap, BehaviorSubject, tap, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { collectionToPage } from '../../../core/collection';
import { AppService } from '../../../app.service';

@Component({
  selector: 'app-communications',
  templateUrl: './communications.component.html',
  styleUrls: ['./communications.component.scss'],
})
export class CommunicationsComponent {

  readonly page$ = new BehaviorSubject<number | undefined>(undefined);
  readonly documentsPage$ = this.appService.communications$.pipe(
    tap((items) => items.length > 0 ? this.page$.next(1) : undefined),
    switchMap((items) => this.page$.pipe(
      map((page) => collectionToPage(items, page, 2)),
    )),
  );
  readonly hasPrevious$ = this.documentsPage$.pipe(
    map((page) => page.page.offset !== 0),
  );
  readonly hasNext$ = this.documentsPage$.pipe(
    map((page) => page.items.length + page.page.offset < page.total),
  );

  readonly noNewsLabel$ = from(this.appService.getCompanyName()).pipe(
    map((companyName) => (
      companyName
        ? `No news from ${companyName} yet...`
        : 'No news yet...'
    )),
  );

  trackById = trackById;

  constructor(private readonly appService: AppService) { }
}
