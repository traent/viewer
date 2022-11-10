import { ProjectV0 } from '@ledger-objects';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type Project = RedactableBox<ProjectV0> & LedgerResource;
