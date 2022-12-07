import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class LedgerStoredGuard implements CanActivate {

  constructor(
    private readonly router: Router,
    private readonly storageService: StorageService,
  ) { }

  async canActivate(state: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    return this.storageService.getLedgers().length === 0
      ? this.router.createUrlTree(['/'], { queryParams: state.queryParams })
      : true;
  }
}
