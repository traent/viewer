import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { LedgerAccessorService } from '@viewer/services';

@Injectable({ providedIn: 'root' })
export class LedgerSelectedGuard implements CanActivate {

  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly router: Router,
  ) { }

  canActivate(state: ActivatedRouteSnapshot) {
    return this.ledgerAccessorService.selectedLedgerId === undefined
      ? this.router.createUrlTree(['/project/select'], { queryParams: state.queryParams })
      : true;
  }
}
