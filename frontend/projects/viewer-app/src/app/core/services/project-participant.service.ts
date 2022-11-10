import { Injectable } from '@angular/core';
import {
  LedgerProjectParticipant,
  Organization,
  OrganizationCollectionParams,
  ProjectParticipant,
  ProjectParticipantParams,
  WorkflowParticipant,
  WorkflowParticipantID,
} from '@viewer/models';
import { isExported, isExportedAndDefined } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import { Observable, of } from 'rxjs';

import { LedgerObjectsService } from './ledger-objects.service';
import { MemberService } from './member.service';
import { OrganizationService } from './organization.service';
import { collectionSort, collectionToPage, transformerFrom } from '../utils';

export const PROJECT_PARTICIPANT_LABEL = 'ProjectParticipantV0';

@Injectable({ providedIn: 'root' })
export class ProjectParticipantService {
  constructor(
    private readonly ledgerObjectService: LedgerObjectsService,
    private readonly memberService: MemberService,
    private readonly organizationService: OrganizationService,
  ) { }

  async getProjectParticipant(id: string, blockIndex?: number): Promise<ProjectParticipant> {
    if (id === WorkflowParticipantID) {
      return WorkflowParticipant;
    }

    const obj = await this.ledgerObjectService.getObject(PROJECT_PARTICIPANT_LABEL, id, blockIndex);
    return this.parseProjectParticipant(obj);
  }

  async getProjectParticipantCollection(params?: ProjectParticipantParams): Promise<Page<LedgerProjectParticipant>> {
    const currentState = await this.ledgerObjectService.getObjects(params?.blockIndex);
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

  async getOrganizationCollection(params?: OrganizationCollectionParams): Promise<Page<Observable<Organization | undefined>>> {
    const currentState = await this.ledgerObjectService.getObjects(params?.blockIndex);

    const collection = this.extractProjectParticipantsFromState(currentState)
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
      member$: isExported(projectParticipant.memberId)
        ? this.memberService.getMember(projectParticipant.id, projectParticipant.memberId)
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
