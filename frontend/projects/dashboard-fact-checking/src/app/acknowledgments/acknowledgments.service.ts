import { Injectable } from '@angular/core';

import { LedgerContextService } from '../ledger';
import { AcknowledgementStatus, BlockAcknowledgementInfo } from './acknowledgment';

@Injectable({
  providedIn: 'root',
})
export class AcknowledgmentService {

  constructor(
    private readonly ledgerContextService: LedgerContextService,
  ) {
  }

  // FIXME: This is wrong when keys are revoked
  async getAcknowledgementStatus(blockIndex: number): Promise<BlockAcknowledgementInfo> {
    const lastAcknowledgementsList = Object.values(await this.ledgerContextService.getLatestAcknowledgments());
    const receivedAcknowledgements = lastAcknowledgementsList
      .filter((acknowledge) => acknowledge !== undefined && acknowledge.targetBlock >= blockIndex)
      .length;

    return {
      status: receivedAcknowledgements === lastAcknowledgementsList.length
        ? AcknowledgementStatus.COMPLETE
        : receivedAcknowledgements === 0
          ? AcknowledgementStatus.NONE
          : AcknowledgementStatus.PARTIAL,
      total: lastAcknowledgementsList.length,
      acknowledged: receivedAcknowledgements,
    };
  }

  getAcknowledgements(blockIndex: number) {
    return this.ledgerContextService.getAcknowledgments(blockIndex);
  }

  getAuthorKeyId(authorId: string) {
    return this.ledgerContextService.getAuthorKeyId(authorId);
  }

  getLatestAcknowledgements() {
    return this.ledgerContextService.getLatestAcknowledgments();
  }

}
