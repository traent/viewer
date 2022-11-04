import { Injectable } from '@angular/core';
import { ViewerService as ViewerApi } from '@api/services';
import { parseMember, generateMember } from '@viewer/utils';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';
import { Cache, Cacheable, snapshotValue } from '@traent/ts-utils';

import { Member } from '../models';
import { IdentityService } from './identity.service';

@Injectable({ providedIn: 'root' })
export class MemberService {
  private lastMemberId = 0;

  private readonly invalidateCache$ = this.identityService.invalidate$.pipe(mapTo({ fresh: false as const }));

  private readonly mockMembers: { [participantId: string]: Member } = {};
  private readonly memberCache = new Cache((id: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchMember(id).pipe(catchError(() => of(undefined))));
    const r = new Cacheable(fetch, this.invalidateCache$);
    r.dispose$.subscribe(evict);
    return r;
  });

  constructor(
    private readonly identityService: IdentityService,
    private readonly viewerApi: ViewerApi,
  ) {
    identityService.invalidate$.subscribe(() => this.lastMemberId = 0);
  }

  getMember(participantId: string, memberId?: string): Observable<Member> {
    return this.identityService.isAuthenticated$.pipe(
      switchMap(() => memberId
        ? snapshotValue(this.memberCache.get(memberId))
        : of(undefined),
      ),
      map((member) => member ?? this.getFromMockCache(participantId)),
    );
  }

  private getFromMockCache(participantId: string): Member {
    return this.mockMembers[participantId] ||= generateMember(`${++this.lastMemberId}`, participantId);
  }

  private fetchMember(memberId: string): Observable<Member> {
    return this.viewerApi.getViewerMember({ memberId }).pipe(
      map(parseMember),
    );
  }
}
