import { Injectable } from '@angular/core';
import { Cache, Cacheable, snapshotValue } from '@traent/ts-utils';
import { catchError, firstValueFrom, map, Observable, of, tap } from 'rxjs';

import { ViewerService as ViewerApi } from '../identity-viewer-api/services';
import { Organization } from './organization';

@Injectable({
  providedIn: 'root',
})
export class OrganizationService {

  private readonly organizationCache = new Cache((id: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchOrganization(id).pipe(catchError(() => of(undefined))));
    const r = new Cacheable(fetch);
    r.dispose$.subscribe(evict);
    return r;
  });

  private readonly organizationKeyIdCache = new Cache((keyId: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchOrganizationByKey(keyId).pipe(catchError(() => of(undefined))));
    const r = new Cacheable(fetch);
    r.dispose$.subscribe(evict);
    return r;
  });

  constructor(
    private readonly viewerApi: ViewerApi,
  ) {
  }

  getOrganization(organizationId: string): Observable<Organization | undefined> {
    return snapshotValue(this.organizationCache.get(organizationId)).pipe(
      tap((o) => {
        if (o === undefined) {
          throw new Error('Organization not found');
        }
      }),
      catchError(() => of(undefined)),
    );
  }

  getOrganizationByKey(keyId: string): Observable<Organization | undefined> {
    return snapshotValue(this.organizationKeyIdCache.get(keyId)).pipe(
      tap((o) => {
        if (o === undefined) {
          throw new Error('Organization not found');
        }
      }),
      catchError(() => of(undefined)),
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
