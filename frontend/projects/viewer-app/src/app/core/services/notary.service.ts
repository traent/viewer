import { Injectable } from '@angular/core';
import type { Indexer } from 'algosdk';

import { AlgorandNotaryAccessInfo, Notary, NotaryConnectionInfo, notaryServerInfo, requiredTrustedNotaries } from '../models/notary';

const getBaseServer = (network: string): NotaryConnectionInfo => {
  switch (network) {
    case 'algorand-mainnet': return notaryServerInfo['algorand-mainnet'];
    case 'algorand-testnet': return notaryServerInfo['algorand-testnet'];
    default: throw new Error(`Unknown network: ${network}`);
  }
};

@Injectable({ providedIn: 'root' })
export class NotaryService {
  private indexerClient?: typeof Indexer;

  async getDigests(notary: Notary): Promise<[string[], string[]]> {
    const problems: string[] = [];

    const trustedNotary = requiredTrustedNotaries[notary.id as any as keyof typeof requiredTrustedNotaries];
    if (!trustedNotary) {
      return [[], [`Untrusted notary ${notary.id}`]];
    }

    if (trustedNotary.account !== notary.addressId) {
      problems.push(`Invalid address: found ${notary.addressId}, expected ${trustedNotary.account}`);
    }
    if (trustedNotary.network !== notary.network) {
      problems.push(`Invalid network: found ${notary.network}, expected ${trustedNotary.network}`);
    }

    switch (trustedNotary.network) {
      case 'algorand-mainnet':
      case 'algorand-testnet': {
        const [digests, digestProblems] = await this.getAlgorandDigests(trustedNotary);
        problems.push(...digestProblems);
        return [digests, problems];
      }
      default: throw new Error('Invalid trusted notaries');
    }
  }

  async getAlgorandDigests(notary: AlgorandNotaryAccessInfo): Promise<[string[], string[]]> {
    const problems: string[] = [];

    this.indexerClient ??= (await import('algosdk')).Indexer;

    const notaryServer = getBaseServer(notary.network);
    const indexerClient = new this.indexerClient(notary.token, notaryServer.address, notaryServer.port);
    const baseQuery = indexerClient.lookupAccountTransactions(notary.account);

    const transactions: string[] = [];
    let nextToken: string | undefined;
    do {
      const pageQuery = nextToken ? baseQuery.nextToken(nextToken) : baseQuery;

      try {
        const response = await pageQuery.do();
        transactions.push(...response.transactions.filter((t: any) => t.sender === notary.account).map((t: any) => t.note));

        nextToken = response.transactions.length ? response['next-token'] : undefined;
      } catch (error: any) {
        problems.push(`Error getting transactions: ${error.message}`);
      }
    } while (nextToken);

    return [transactions.reverse(), problems];
  }
}
