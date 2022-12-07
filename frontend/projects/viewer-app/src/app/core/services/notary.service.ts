import { Injectable } from '@angular/core';

import { AlgorandNotaryAccessInfo, Notary, NotaryConnectionInfo, notaryServerInfo, requiredTrustedNotaries } from '../models/notary';

const getBaseServer = (network: string): NotaryConnectionInfo => {
  switch (network) {
    case 'algorand-mainnet':
    case 'algorand-testnet':
      return notaryServerInfo[network];

    default: throw new Error(`Unknown network: ${network}`);
  }
};

@Injectable({ providedIn: 'root' })
export class NotaryService {
  private readonly algosdk$ = import('algosdk');

  async getDigests(notary: Notary) {
    const problems: string[] = [];

    const trustedNotary = requiredTrustedNotaries[notary.id];
    if (!trustedNotary) {
      return { problems: [`Untrusted notary ${notary.id}`] };
    }

    if (trustedNotary.account !== notary.addressId) {
      problems.push(`Invalid address: found ${notary.addressId}, expected ${trustedNotary.account}`);
    }
    if (trustedNotary.network !== notary.network) {
      problems.push(`Invalid network: found ${notary.network}, expected ${trustedNotary.network}`);
    }

    return problems.length
      ? { problems }
      : this.getAlgorandDigests(trustedNotary);
  }

  private async getAlgorandDigests(notary: AlgorandNotaryAccessInfo) {
    const algosdk = await this.algosdk$;

    const notaryServer = getBaseServer(notary.network);
    const indexerClient = new algosdk.Indexer(notary.token, notaryServer.address, notaryServer.port);
    const baseQuery = indexerClient
      .lookupAccountTransactions(notary.account)
      .minRound(notary.minRound);

    const transactions: string[] = [];
    let nextToken: string | undefined;
    do {
      const pageQuery = nextToken ? baseQuery.nextToken(nextToken) : baseQuery;

      try {
        const response = await pageQuery.do();
        const outgoingTransactions = response.transactions.filter((t: any) => t.sender === notary.account);
        transactions.push(...outgoingTransactions.map((t: any) => t.note));

        nextToken = response['next-token'];
        if (!outgoingTransactions.length || outgoingTransactions[outgoingTransactions.length - 1]['confirmed-round'] === notary.minRound) {
          nextToken = undefined;
        }
      } catch (error: any) {
        return { problems: [`Error getting transactions: ${error.message}`] };
      }
    } while (nextToken);

    return { digests: transactions.reverse() };
  }
}
