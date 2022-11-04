import { Injectable } from '@angular/core';
import { isExported, isExportedAndDefined } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import { of } from 'rxjs';

import { collectionToPage } from '../collection';
import { LedgerContextService } from '../ledger';
import { MemberService } from '../member';
import { OrganizationService } from '../organization';
import { TagsService } from '../tags';
import { WorkflowParticipantID } from '../workflow';
import {
  LedgerProjectParticipant,
  ProjectParticipant,
  ProjectParticipantParams,
  PROJECT_PARTICIPANT_LABEL,
  WorkflowParticipant,
} from './participant';

@Injectable({
  providedIn: 'root',
})
export class ParticipantsService {

  constructor(
    private readonly ledgerContextService: LedgerContextService,
    private readonly memberService: MemberService,
    private readonly organizationService: OrganizationService,
    private readonly tagsService: TagsService,
  ) {
  }

  async getParticipantsPage(params?: ProjectParticipantParams): Promise<Page<ProjectParticipant>> {
    let collection = await this.ledgerContextService.getAll(PROJECT_PARTICIPANT_LABEL);
    collection = collection.map((i) => this.parseProjectParticipant(i));

    if (params?.tagId) {
      const tagEntries = await this.tagsService.getTagEntries({ tagId: params.tagId });
      collection = collection.filter((i) => tagEntries.some((entry) => entry.taggedResourceId === i.id));
    }

    return collectionToPage(
      collection,
      params?.page,
      params?.limit,
    );
  }

  async getParticipant(id: string): Promise<ProjectParticipant> {
    if (id === WorkflowParticipantID) {
      return WorkflowParticipant;
    }

    const obj = await this.ledgerContextService.retrieve(id);
    return this.parseProjectParticipant(obj);
  }

  // eslint-disable-next-line class-methods-use-this
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
}
