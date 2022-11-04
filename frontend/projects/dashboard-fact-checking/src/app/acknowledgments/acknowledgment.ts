export interface Acknowledgement {
  blockIndex: number;
  targetBlock: number;
}

export enum AcknowledgementStatus {
  NONE = 'NONE',
  PARTIAL = 'PARTIAL',
  COMPLETE = 'COMPLETE',
};

export interface BlockAcknowledgementInfo {
  status: AcknowledgementStatus;
  total: number;
  acknowledged: number;
}
