import { Injectable } from '@angular/core';

import { DotNetWrapperService } from './dotnet-wrapper.service';

export class BlockParsingError extends Error {
  constructor(data: DotNet.InputByteArray, error: any) {
    super();
    this.message = `Unable to parse the block: ${data}`;
    this.name = 'BlockParsingError';
    this.stack = error.stack;
  }
}

@Injectable({ providedIn: 'root' })
export class LedgerBlockParseService {
  constructor(private readonly dotNet: DotNetWrapperService) { }

  async parse(data: DotNet.InputByteArray): Promise<Ledger.Parser.Block> {
    try {
      return await this.dotNet.parse(data);
    } catch (err) {
      throw new BlockParsingError(data, err);
    }
  }
}
