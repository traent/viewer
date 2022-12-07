import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LedgerAccessorService } from '@viewer/services';
import { firstValueFrom, map, Observable } from 'rxjs';

@Component({
  selector: 'app-ledger-side-info',
  templateUrl: './ledger-side-info.component.html',
  styleUrls: ['./ledger-side-info.component.scss'],
})
export class LedgerSideInfoComponent {
  readonly ledgerId$: Observable<string | undefined> = this.route.params.pipe(map(({ ledgerId }) => ledgerId));

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    readonly route: ActivatedRoute,
    readonly router: Router,
  ) { }

  async navigate(dst: 'organizations' | 'participants' | 'explorer' | 'cross-project-references') {
    if (dst === 'organizations') {
      this.router.navigate(['organizations'], { relativeTo: this.route, queryParamsHandling: 'merge' });
    } else if (dst === 'participants') {
      this.router.navigate(['participants'], { relativeTo: this.route, queryParamsHandling: 'merge' });
    } else if (dst === 'explorer') {
      const ledgerId = await firstValueFrom(this.ledgerId$);
      this.ledgerAccessorService.selectLedger(ledgerId);
      this.router.navigate(['/explorer']);
    } else if (dst === 'cross-project-references') {
      this.router.navigate(['linked-projects'], { relativeTo: this.route, queryParamsHandling: 'merge' });
    }
  }
}
