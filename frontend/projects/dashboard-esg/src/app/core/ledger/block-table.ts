export interface BlockIdentification {
  index: number;
  linkHash: Uint8Array;
  createdAt?: string;
}

export type BlockIndexed = Partial<{ blockIndex: number }>;

export type BlockItem = BlockIdentification;
