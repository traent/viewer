import { Injectable } from '@angular/core';
import { Project } from '@viewer/models';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { parseUid, transformerFrom } from '../utils';

export const PROJECT_LABEL = 'ProjectV0';

export const parseProject = (obj: any): Project => obj as Project;
const extractProjectsFromState = (state: LedgerState): Project[] =>
  transformerFrom(parseProject)(state[PROJECT_LABEL]);

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getLedgerProject(ledgerId?: string): Promise<Project | undefined> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const objects = await ledger.getObjects();
    const collection = extractProjectsFromState(objects);
    return collection[0];
  }

  async findProjectByUid(uid: string) {
    const { ledgerId, resourceId } = parseUid(uid);
    let project: Project | undefined;
    try {
      project = await this.getLedgerProject(ledgerId);
    } catch { }

    return project?.id === resourceId ? project : undefined;
  }
}
