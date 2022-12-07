import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerAccessorService } from '@viewer/services';
import { map } from 'rxjs';

@Component({
  selector: 'app-ledger-side-cross-project-references',
  templateUrl: './ledger-side-cross-project-references.component.html',
  styleUrls: ['./ledger-side-cross-project-references.component.scss'],
})
export class LedgerSideCrossProjectReferencesComponent {
  readonly ledgerId$ = this.route.params.pipe(map(({ ledgerId }) => ledgerId));

  constructor(
    readonly route: ActivatedRoute,
    readonly router: Router,
    private readonly ledgerAccessorService: LedgerAccessorService,
  ) { }

  navigateLedger(ledgerId: string) {
    this.ledgerAccessorService.selectLedger(ledgerId);
    this.router.navigate(['/ui-refresh']);
  }
}
