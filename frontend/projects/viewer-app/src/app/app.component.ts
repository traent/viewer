import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { LedgerService } from '@viewer/services';
import { getStyleFromRoute } from '@viewer/utils';
import { filter, first } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  @HostListener('window:beforeunload', ['$event']) handleLedgerLeaving($event: any) {
    if (this.ledgerService.archiveLoaded) {
      $event.returnValue = true;
    }
  }

  constructor(
    @Inject(DOCUMENT) document: Document,
    private readonly ledgerService: LedgerService,
    router: Router,
  ) {
    router.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      first(),
    ).subscribe((event) => {
      const style = getStyleFromRoute(event.snapshot);
      if (style && typeof style === 'object') {
        Object.keys(style).forEach((key) => document.documentElement.style.setProperty(key, style[key]));
      }
    });
  }
}
