import { Injectable } from '@angular/core';
import { UserService as UserApi } from '@api/services';
import { UserProfileFieldName } from '@api/models';
import { User } from '@viewer/models';
import { OidcSecurityService, PopUpService } from 'angular-auth-oidc-client';
import { NgxT3DialogService } from '@traent/ngx-dialog';
import { BehaviorSubject, firstValueFrom, merge, shareReplay } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';

import { LedgerService } from './ledger.service';

@Injectable({ providedIn: 'root' })
export class IdentityService {

  readonly isAuthenticated$ = this.oidcSecurityService.isAuthenticated$.pipe(
    map((res) => res.isAuthenticated),
  );

  readonly user$ = this.isAuthenticated$.pipe(
    filter((isAuthenticated) => !!isAuthenticated),
    switchMap(() => this.fetchCurrentUser()),
    startWith(undefined),
    tap({
      error: () => this.isPopupClosed$.next(true),
    }),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly invalidate$ = merge(
    this.isAuthenticated$,
    this.ledgerService.reset$,
  );

  readonly isPopupClosed$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly dialogService: NgxT3DialogService,
    private readonly ledgerService: LedgerService,
    private readonly oidcSecurityService: OidcSecurityService,
    private readonly popupService: PopUpService,
    private readonly userApi: UserApi,
  ) {
    this.popupService.result$.subscribe(() => this.isPopupClosed$.next(true));
  }

  login() {
    this.isPopupClosed$.next(false);
    return firstValueFrom(this.oidcSecurityService.authorizeWithPopUp({
      customParams: {
        popup: true,
      },
    }, {
      height: 700,
      width: 500,
    }));
  }

  logout() {
    return this.oidcSecurityService.logoff();
  }

  async requestUILogout() {
    const isAuthenticated = await firstValueFrom(this.isAuthenticated$);
    if (!isAuthenticated) {
      return;
    }
    let confirm = true;
    if (this.ledgerService.archiveLoaded) {
      confirm = await this.dialogService.confirm({
        title: 'Logout',
        description: 'Logging out will close the current project and redirect you to the upload page.',
        primaryLabel: 'Logout',
        secondaryLabel: 'Cancel',
      }).then((v) => !!v);
    }

    if (confirm) {
      this.logout();
    }
  }

  private async fetchCurrentUser(): Promise<User | undefined> {
    try {
      return await firstValueFrom(this.userApi.getCurrentUser().pipe(
        map((user) => {
          const firstName = user.profile.fields.find((f) => f.name === UserProfileFieldName.GivenName)?.value || '';
          const lastName = user.profile.fields.find((f) => f.name === UserProfileFieldName.FamilyName)?.value || '';
          return {
            id: user.id,
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`,
            avatar: user.profile.fields.find((f) => f.name === UserProfileFieldName.Avatar)?.value,
            validation: user.profile.validation,
          };
        }),
      ));
    } catch {
      return undefined;
    }
  }
}
