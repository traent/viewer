import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerService } from '@viewer/services';
import { getHeaderControlFromRoute } from '@viewer/utils';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss'],
})
export class ViewerComponent {

  readonly showHeader = getHeaderControlFromRoute(this.route.snapshot);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    readonly ledgerService: LedgerService,
  ) {
  }

  async closeLedger(): Promise<void> {
    this.ledgerService.reset();
    this.router.navigate(['/']);
  }
}
