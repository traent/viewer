import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isNotNullOrUndefined, required } from '@traent/ts-utils';

/**
 * Note: this is a copy of the OrgApp's sidebar manager service. It could be moved to a shared library.
 */
@Injectable()
export class RightSidebarManagerService {
  storeKey?: string;

  private readonly _showSidebarPreference$ = new BehaviorSubject<boolean | undefined>(undefined);
  readonly showSidebarPreference$ = this._showSidebarPreference$.pipe(isNotNullOrUndefined());

  initStoreKey(key: string): void {
    if (this.storeKey) {
      throw new Error('Store key already set');
    }
    this.storeKey = key;
    this._showSidebarPreference$.next(JSON.parse(localStorage.getItem(key) || 'true'));
  }

  setShowSidebarPreference(value: boolean): void {
    required(this.storeKey, 'Cannot set sidebar preference without a store key');
    localStorage.setItem(this.storeKey, JSON.stringify(value));
    this._showSidebarPreference$.next(value);
  }
}
