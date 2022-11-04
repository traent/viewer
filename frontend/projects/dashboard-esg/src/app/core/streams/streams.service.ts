import { Injectable } from '@angular/core';

import { LedgerContextService } from '../ledger';
import { parseStream, STREAM_LABEL, StreamEntry } from './stream';

@Injectable({
  providedIn: 'root',
})
export class StreamsService {

  constructor(private readonly ledgerContext: LedgerContextService) {
  }

  async getStreamByMachineName(machineName: string) {
    const collection = await this.ledgerContext.getAll(STREAM_LABEL);
    return collection.map(parseStream).find((item: StreamEntry) => item.machineName === machineName);
  }

  async getStreamByName(name: string) {
    const collection = await this.ledgerContext.getAll(STREAM_LABEL);
    return collection.map(parseStream).find((item: StreamEntry) => item.name === name);
  }
}
