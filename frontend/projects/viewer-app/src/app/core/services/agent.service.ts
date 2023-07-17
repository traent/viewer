import { Injectable } from '@angular/core';
import { ViewerService as ViewerApi } from '@api/services';
import { Cache, Cacheable, snapshotValue } from '@traent/ts-utils';
import { generateMember } from '@viewer/utils';
import { firstValueFrom, Observable, of } from 'rxjs';
import { catchError, map, mapTo, switchMap } from 'rxjs/operators';

import { IdentityService } from './identity.service';
import { Agent } from '../models';

@Injectable({ providedIn: 'root' })
export class AgentService {
  private lastMemberId = 0;

  private readonly invalidateCache$ = this.identityService.invalidate$.pipe(mapTo({ fresh: false as const }));

  private readonly mockMembers: { [participantId: string]: Partial<Agent> } = {};
  private readonly agentCache = new Cache((id: string, evict: any) => {
    const fetch = () => firstValueFrom(this.fetchAgent(id).pipe(catchError(() => of(undefined))));
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

  getAgent(participantId: string, memberId?: string): Observable<Partial<Agent>> {
    return this.identityService.isAuthenticated$.pipe(
      switchMap(() => memberId
        ? snapshotValue(this.agentCache.get(memberId))
        : of(undefined),
      ),
      map((member) => member ?? this.getFromMockCache(participantId)),
    );
  }

  private getFromMockCache(participantId: string): Partial<Agent> {
    return this.mockMembers[participantId] ||= generateMember(`${++this.lastMemberId}`, participantId);
  }

  private fetchAgent(agentId: string): Observable<Agent> {
    return this.viewerApi.getViewerAgent({ agentId }).pipe(
      map((viewerAgent) =>
        viewerAgent.firstName == null && viewerAgent.lastName == null
          ? viewerAgent
          : ({
            ...viewerAgent,
            shortName: `${viewerAgent.firstName} ${viewerAgent.lastName?.at(0)}.`,
            fullName: `${viewerAgent.firstName} ${viewerAgent.lastName}`,
          })),
    );
  }
}
