import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { b64ToB64UrlEncoding } from '@viewer/utils';
import { BehaviorSubject } from 'rxjs';

import { AcknowledgementService } from './acknowledgement.service';
import { DocumentService } from './document.service';
import { LedgerObjectsService } from './ledger-objects.service';
import { StorageService } from './storage.service';

const invoke = <T>(worker: ServiceWorker, operation: string, payload?: any) =>
  new Promise<T>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => resolve(event.data);
    worker.postMessage({ operation, payload }, [channel.port2]);
  });

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
  readonly clientId$ = new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly documentService: DocumentService,
    private readonly ledgerObjectService: LedgerObjectsService,
    private readonly storageService: StorageService,
    private readonly router: Router,
    private readonly zone: NgZone,
  ) { }

  async init() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.oncontrollerchange = () => this.getClientId();
      navigator.serviceWorker.onmessage = (event) =>
        this.handle(event.data.operation, event.data.payload, event.ports[0]);

      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await registration.update();

      await this.getClientId();
    } else {
      throw new Error('Unsupported environment');
    }
  }

  async getClientId() {
    const registration = await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (worker) {
      const clientId = await invoke<string>(worker, 'getClientId');
      this.clientId$.next(clientId);
    } else {
      throw new Error('Could not retrieve client id from service worker');
    }
  }

  async handle(operation: string, payload: any, port?: MessagePort) {
    switch (operation) {
      case 'getContextPort':
        const channel = new MessageChannel();
        channel.port1.onmessage = async (event) =>
          event.ports[0]?.postMessage(await this.zone.run(() => this.handleContext(event.data.operation, event.data.payload)));
        return port?.postMessage(undefined, [channel.port2]);

      case 'getDocument':
        return port?.postMessage(await this.getDocument(payload));

      default: throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  async handleContext(operation: string, payload: any) {
    switch (operation) {
      case 'getAcknowledgements': return this.getAcknowledgements(payload);
      case 'getAll': return this.getAll(payload);
      case 'getAuthorKeyId': return this.getAuthorKeyId(payload);
      case 'getBlockIdentification': return this.getBlockIdentification(payload);
      case 'getLatestAcknowledgements': return this.getLatestAcknowledgements();
      case 'retrieve': return this.retrieve(payload);
      case 'navigateByUrl': return this.navigateByUrl(payload);
      default: throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  private async getDocument(payload: { ledgerId: string; id: string }) {
    await this.checkLedgerId(payload.ledgerId);
    const document = await this.documentService.getDocument(payload.id);

    return {
      content: await document.getData(),
      contentType: document.contentType,
    };
  }

  private async getAcknowledgements(payload: { blockIndex: number }) {
    return this.acknowledgementService.getAcknowledgements(payload.blockIndex);
  }

  private async getAll(payload: { type: string }) {
    const state = await this.ledgerObjectService.getObjects();
    return Object.values(state[payload.type]);
  }

  private async getAuthorKeyId(payload: { authorId: string }) {
    return this.acknowledgementService.getAuthorKeyId(payload.authorId);
  }

  private async getBlockIdentification(payload: { blockIndex: number }) {
    return this.storageService.getBlockIdentification(payload.blockIndex);
  }

  private async getLatestAcknowledgements() {
    return await this.acknowledgementService.getLatestAcknowledgements();
  }

  private async navigateByUrl(payload: { url: string }) {
    await this.router.navigateByUrl(payload.url);
  }

  private async retrieve(payload: { id: string }) {
    const id = payload.id;
    const state = await this.ledgerObjectService.getObjects();
    for (const collection of Object.values(state)) {
      if (id in collection) {
        return collection[id];
      }
    }
    return undefined;
  }

  private async checkLedgerId(ledgerId: string) {
    const ledger = await this.storageService.getLedgerInfo();
    if (ledgerId !== b64ToB64UrlEncoding(ledger.address)) {
      throw new Error(`Unknown ledger: ${ledgerId}`);
    }
  }
}
