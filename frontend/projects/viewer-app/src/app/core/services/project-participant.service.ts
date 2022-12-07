import { Injectable } from '@angular/core';
import { isExported, isExportedAndDefined } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import {
  LedgerProjectParticipant,
  Organization,
  ProjectParticipant,
  ProjectParticipantParams,
  WorkflowParticipant,
  WorkflowParticipantID,
} from '@viewer/models';
import { Observable, of } from 'rxjs';

import { AgentService } from './agent.service';
import { LedgerAccessorService } from './ledger-accessor.service';
import { OrganizationService } from './organization.service';
import { collectionSort, collectionToPage, ResourceParams, transformerFrom } from '../utils';

export const PROJECT_PARTICIPANT_LABEL = 'ProjectParticipantV0';

@Injectable({ providedIn: 'root' })
export class ProjectParticipantService {
  constructor(
    private readonly agentService: AgentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly organizationService: OrganizationService,
  ) { }

  async getProjectParticipant({ id, blockIndex, ledgerId }: ResourceParams): Promise<ProjectParticipant> {
    if (id === WorkflowParticipantID) {
      return WorkflowParticipant;
    }

    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const obj = await ledger.getObject(PROJECT_PARTICIPANT_LABEL, id, blockIndex);
    return this.parseProjectParticipant(obj);
  }

  async getProjectParticipantCollection(params?: ProjectParticipantParams): Promise<Page<LedgerProjectParticipant>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = this.extractProjectParticipantsFromState(currentState);

    if (params?.organizationId) {
      collection = collection.filter((entry) => entry.organizationId === params.organizationId);
    }

    if (params?.roles) {
      const roleFilter = params.roles;
      collection = collection.filter((entry) => isExported(entry.role) && roleFilter.includes(entry.role));
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'updatedAt', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  async getOrganizationCollection(params?: ProjectParticipantParams): Promise<Page<Observable<Organization | undefined>>> {
    const participants = await this.getProjectParticipantCollection(params);
    const collection = participants.items
      .map(({ organizationId }) => organizationId)
      .filter((organizationId): organizationId is string => organizationId !== undefined)
      .reduce((p, c) => !p.includes(c) ? [...p, c] : p, [] as string[])
      .map((organizationId) => this.organizationService.getOrganization(organizationId));

    return collectionToPage(
      collection,
      params?.page,
      params?.limit,
    );
  }

  parseProjectParticipant(obj: any): LedgerProjectParticipant {
    const projectParticipant = obj;
    return {
      ...projectParticipant,
      agent$: isExported(projectParticipant.memberId)
        ? this.agentService.getAgent(projectParticipant.id, projectParticipant.memberId)
        : of(undefined),
      organization$: isExportedAndDefined(projectParticipant.organizationId)
        ? this.organizationService.getOrganization(projectParticipant.organizationId)
        : of(undefined),
    };
  }

  private extractProjectParticipantsFromState(state: any): LedgerProjectParticipant[] {
    return transformerFrom(this.parseProjectParticipant.bind(this))(state[PROJECT_PARTICIPANT_LABEL]);
  }
}
