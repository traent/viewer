export interface NotaryProof {
  ledgerId: string;
  iteration: number;
  pathHistory: string[][];
  merkleConsistencyProofs: string[];
  merkleRoot: string;
}

export interface Notarization {
  name: string;
  json$: Promise<NotaryProof>;
}
