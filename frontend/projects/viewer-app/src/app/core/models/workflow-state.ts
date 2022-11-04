import { WorkflowStateV0 } from '@ledger-objects';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type WorkflowState = RedactableBox<WorkflowStateV0> & LedgerResource;
