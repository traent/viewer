import { Injectable } from '@angular/core';
import { Project } from '@viewer/models';

import { LedgerObjectsService, LedgerState } from './ledger-objects.service';
import { transformerFrom } from '../utils';

export const PROJECT_LABEL = 'ProjectV0';

export const parseProject = (obj: any): Project => obj as Project;
const extractProjectsFromState = (state: LedgerState): Project[] =>
  transformerFrom(parseProject)(state[PROJECT_LABEL]);

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private readonly ledgerObjectService: LedgerObjectsService) { }

  async getLedgerProject(): Promise<Project | undefined> {
    const objects = await this.ledgerObjectService.getObjects();
    const collection = extractProjectsFromState(objects);
    return collection.length ? collection[0] : undefined;
  }
}
