import { Component, HostListener } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { LedgerService, UiConfigurationService } from '@viewer/services';
import { getHeaderControlFromRoute, getHideCancelUploadControlFromRoute, getStyleFromRoute } from '@viewer/utils';
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
    private readonly ledgerService: LedgerService,
    private readonly uiConfigurationService: UiConfigurationService,
    router: Router,
  ) {
    router.events.pipe(
      filter((event): event is ActivationEnd => event instanceof ActivationEnd),
      first(),
    ).subscribe((event) => {
      const style = getStyleFromRoute(event.snapshot);
      const header = getHeaderControlFromRoute(event.snapshot);
      const hideCancelUpload = !!getHideCancelUploadControlFromRoute(event.snapshot);

      this.uiConfigurationService.setUiConfiguration({
        style: event.snapshot.queryParams['style'] && style,
        header: event.snapshot.queryParams['header'] && header,
        hideCancelUpload: event.snapshot.queryParams['hideCancelUpload'] && hideCancelUpload,
      });
    });
  }
}
