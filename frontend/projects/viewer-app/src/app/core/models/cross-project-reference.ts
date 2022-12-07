import { CrossProjectReferenceV0 } from '@ledger-objects';
import { ResourceCollectionParams } from '@viewer/utils';

import { LedgerResource, RedactableBox } from './ledger-resource';

export type CrossProjectReference = RedactableBox<CrossProjectReferenceV0> & LedgerResource;

export type CrossProjectParams = Partial<{
  projectId: string;
  targetId: string;
}> & ResourceCollectionParams<CrossProjectReference>;
