import { Injectable } from '@angular/core';
import { ViewerService as ViewerApi } from '@api/services';
import { Cache, Cacheable, snapshotValue } from '@traent/ts-utils';
import { Organization } from '@viewer/models';
import { catchError, firstValueFrom, map, mapTo, Observable, of, switchMap } from 'rxjs';

import { IdentityService } from './identity.service';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly invalidateCache$ = this.identityService.invalidate$.pipe(mapTo({ fresh: false as const }));

  private readonly organizationCache = new Cache((id: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchOrganization(id).pipe(catchError(() => of(undefined))));
    const r = new Cacheable(fetch, this.invalidateCache$);
    r.dispose$.subscribe(evict);
    return r;
  });

  private readonly organizationKeyIdCache = new Cache((keyId: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchOrganizationByKey(keyId).pipe(catchError(() => of(undefined))));
    const r = new Cacheable(fetch, this.invalidateCache$);
    r.dispose$.subscribe(evict);
    return r;
  });

  constructor(
    private readonly identityService: IdentityService,
    private readonly viewerApi: ViewerApi,
  ) { }

  getOrganization(organizationId: string): Observable<Organization | undefined> {
    return this.identityService.isAuthenticated$.pipe(
      switchMap(() => snapshotValue(this.organizationCache.get(organizationId))),
    );
  }

  getOrganizationByKey(keyId: string): Observable<Organization | undefined> {
    return this.identityService.isAuthenticated$.pipe(
      switchMap(() => snapshotValue(this.organizationKeyIdCache.get(keyId))),
    );
  }

  private fetchOrganizationByKey(keyId: string): Observable<Organization | undefined> {
    return this.viewerApi.getViewerOrganizationByKeyId({ keyId }).pipe(
      map((o) => ({ ...o })),
      catchError(() => of(undefined)),
    );
  }

  private fetchOrganization(organizationId: string): Observable<Organization> {
    return this.viewerApi.getViewerOrganization({ organizationId }).pipe(
      map((o) => ({ ...o })),
    );
  };
}
