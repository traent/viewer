import { NotaryProof } from '../services/index';

export interface Notarization {
  name: string;
  json$: Promise<NotaryProof>;
}
