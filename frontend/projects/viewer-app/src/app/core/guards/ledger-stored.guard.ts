import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, UrlTree } from '@angular/router';

import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class LedgerStoredGuard implements CanActivate {

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
  ) { }

  async canActivate(state: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    try {
      return !!(await this.storageService.getLedger().getLedgerInfo());
    } catch {
      return this.router.createUrlTree(['/'], { queryParams: state.queryParams });
    }
  }
}
