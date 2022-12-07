import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerAccessorService } from '@viewer/services';

@Component({
  selector: 'app-project-side-cross-project-references',
  templateUrl: './project-side-cross-project-references.component.html',
  styleUrls: ['./project-side-cross-project-references.component.scss'],
})
export class ProjectSideCrossProjectReferencesComponent {
  constructor(
    readonly router: Router,
    readonly route: ActivatedRoute,
    private readonly ledgerAccessorService: LedgerAccessorService,
  ) { }

  navigateLedger(ledgerId: string) {
    this.ledgerAccessorService.selectLedger(ledgerId);
    this.router.navigate(['/ui-refresh']);
  }
}
