import { Component, Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxT3DialogService } from '@traent/ngx-dialog';

@Injectable({
  providedIn: 'root',
})
export class LedgerUnloadGuard implements CanDeactivate<any> {
  private readonly dialogService = inject(NgxT3DialogService);
  private readonly translateService = inject(TranslateService);

  async canDeactivate(
    _component: Component,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot,
  ): Promise<boolean> {
    let confirm = true;

    if (nextState.url === '/' || nextState.url.startsWith('/?')) {
      confirm = await this.dialogService.confirm({
        title: this.translateService.instant('i18n.QuittingLedgerDialog.title'),
        description: this.translateService.instant('i18n.QuittingLedgerDialog.description'),
        primaryLabel: this.translateService.instant('i18n.Common.goBack'),
        secondaryLabel: this.translateService.instant('i18n.Common.cancel'),
      }).then((v) => !!v);

      history.pushState(null, document.title, document.location.pathname);
    }

    return confirm;
  }
}
