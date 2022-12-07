import { Injectable } from '@angular/core';

import { LedgerContextService } from '../ledger';
import { parseStream, STREAM_LABEL } from './stream';

@Injectable({
  providedIn: 'root',
})
export class StreamsService {

  constructor(private readonly ledgerContext: LedgerContextService) {
  }

  async getStreamByMachineName(machineName: string) {
    const collection = await this.ledgerContext.getAll(STREAM_LABEL);
    return collection.map(parseStream).find((item) => item.machineName === machineName);
  }
}
