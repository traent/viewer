import { Injectable } from '@angular/core';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Cache, Cacheable, snapshotValue } from '@traent/ts-utils';

import { ViewerService as ViewerApi } from '../identity-viewer-api/services';
import { generateMember, Member, parseMember } from './member';

@Injectable({
  providedIn: 'root',
})
export class MemberService {
  private lastMemberId = 0;

  private readonly mockMembers: { [participantId: string]: Member } = {};

  private readonly memberCache = new Cache((id: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchMember(id).pipe(catchError(() => of(undefined))));
    const r = new Cacheable(fetch);
    r.dispose$.subscribe(evict);
    return r;
  });

  constructor(
    private readonly viewerApi: ViewerApi,
  ) {
  }

  getMember(participantId: string, memberId?: string): Observable<Member | undefined> {
    if (!memberId) {
      return of(this.getFromMockCache(participantId));
    }

    return snapshotValue(this.memberCache.get(memberId)).pipe(
      tap((o) => {
        if (o === undefined) {
          throw new Error('Member not found');
        }
      }),
      catchError(() => of(this.getFromMockCache(participantId))),
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
