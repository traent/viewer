import { Injectable } from '@angular/core';

import { LedgerContextService } from '../ledger';
import { Project, PROJECT_LABEL } from './project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  constructor(
    private readonly ledgerContextService: LedgerContextService,
  ) {
  }

  async getProject(): Promise<Project | undefined> {
    const collection = await this.ledgerContextService.getAll(PROJECT_LABEL);
    return collection.length ? collection[0] : undefined;
  }
}
