import { LedgerResource, RedactableBox } from '../ledger';
import { ProjectV0 } from '../ledger-objects/models';

export const PROJECT_LABEL = 'ProjectV0';

export type Project = RedactableBox<ProjectV0> & LedgerResource;
