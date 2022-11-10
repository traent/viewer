import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';

import { StorageService } from '../services/storage.service';

@Injectable({ providedIn: 'root' })
export class LedgerStoredGuard implements CanActivate {

  constructor(
    private readonly storageService: StorageService,
    private readonly router: Router,
  ) { }

  async canActivate(): Promise<boolean | UrlTree> {
    try {
      return !!(await this.storageService.getLedgerInfo());
    } catch {
      return this.router.createUrlTree(['/']);;
    }
  }
}
