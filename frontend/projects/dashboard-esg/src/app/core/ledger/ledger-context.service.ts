import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LedgerContextService {

  private readonly v1Api$ = import(/* webpackIgnore: true */ '../../../../well-known/view-v1.js');
  private readonly ledgerContext$ = this.v1Api$.then((module) => module.ledgerContext);

  async getAcknowledgments(blockIndex: number) {
    const context = await this.ledgerContext$;
    return context.getAcknowledgements(blockIndex);
  }

  async getAll(type: string) {
    const context = await this.ledgerContext$;
    return context.getAll(type);
  }

  async getAuthorKeyId(authorId: string) {
    const context = await this.ledgerContext$;
    return context.getAuthorKeyId(authorId);
  }

  async getBlockIdentification(blockIndex: number) {
    const context = await this.ledgerContext$;
    return context.getBlockIdentification(blockIndex);
  }

  async getLatestAcknowledgments() {
    const context = await this.ledgerContext$;
    return context.getLatestAcknowledgements();
  }

  async retrieve(id: string) {
    const context = await this.ledgerContext$;
    return context.retrieve(id);
  }
}
