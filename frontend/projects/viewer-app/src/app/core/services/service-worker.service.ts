import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { isRedacted } from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { BehaviorSubject } from 'rxjs';

import { DocumentService } from './document.service';
import { LedgerAccessorService, ObjectLedger } from './ledger-accessor.service';

import { ChangeFilter, LedgerChange, LedgerObject, ObjectFilter, Page } from '*/well-known/view-v2.js';

const clonableRedactedMarker = new Error('Redacted');

const replaceRedacted = <T extends LedgerChange | LedgerObject>(target: T): T => {
  let fields;
  for (const [k, v] of Object.entries(target.fields)) {
    if (isRedacted(v)) {
      fields ??= { ...target.fields };
      fields[k] = clonableRedactedMarker;
    }
  }

  return fields ? { ...target, fields } : target;
};

const getChanges = async (ledger: ObjectLedger, filter: ChangeFilter): Promise<Page<LedgerChange>> => {
  const { page, items } = await ledger.getChanges(filter);
  return { page, items: items.map(replaceRedacted) };
};

const getObjects = async (ledger: ObjectLedger, filter: ObjectFilter): Promise<Page<LedgerObject>> => {
  const { page, items } = await ledger.getObjectsV2(filter);
  return { page, items: items.map(replaceRedacted) };
};

const invoke = <T>(worker: ServiceWorker, operation: string, payload?: any) =>
  new Promise<T>((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (event) => resolve(event.data);
    worker.postMessage({ operation, payload }, [channel.port2]);
  });

const retrieve = async (ledger: ObjectLedger, payload: { id: string }) => {
  const state = await ledger.getObjects();
  for (const collection of Object.values(state)) {
    if (payload.id in collection) {
      return collection[payload.id];
    }
  }
  return undefined;
};

@Injectable({ providedIn: 'root' })
export class ServiceWorkerService {
  private readonly _clientId$ = new BehaviorSubject<string | undefined>(undefined);
  readonly clientId$ = this._clientId$.pipe(isNotNullOrUndefined());

  constructor(
    private readonly documentService: DocumentService,
    private readonly ledgerAccessorService: LedgerAccessorService,
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

  private async getClientId() {
    const registration = await navigator.serviceWorker.ready;
    const worker = registration.active;
    if (worker) {
      const clientId = await invoke<string>(worker, 'getClientId');
      this._clientId$.next(clientId);
    } else {
      throw new Error('Could not retrieve client id from service worker');
    }
  }

  async handle(operation: string, payload: any, port?: MessagePort) {
    switch (operation) {
      case 'getContextPort':
        const { ledgerId } = payload;
        if (typeof ledgerId !== 'string') {
          throw new Error(`${ledgerId} is not a string`);
        }

        const channel = new MessageChannel();
        channel.port1.onmessage = async (event) =>
          event.ports[0]?.postMessage(await this.zone.run(() => {
            const ledger = this.ledgerAccessorService.getLedger(event.data.payload?.ledgerId ?? ledgerId);
            return this.handleContext(ledger, event.data.operation, event.data.payload);
          }));
        return port?.postMessage(undefined, [channel.port2]);

      case 'getDocument':
        return port?.postMessage(await this.getDocument(payload));

      default: throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  async handleContext(ledger: ObjectLedger, operation: string, payload: any) {
    switch (operation) {
      // V2
      case 'getChanges': return getChanges(ledger, payload.filter);
      case 'getObjects': return getObjects(ledger, payload.filter);

      // V1
      case 'getAcknowledgements': return ledger.getAcknowledgements(payload.blockIndex);
      case 'getAll': return Object.values(await ledger.getObjects().then((state) => state[payload.type]));
      case 'getAuthorKeyId': return ledger.getAuthorKeyId(payload.authorId);
      case 'getBlockIdentification': return ledger.getBlockLedger().getBlockIdentification(payload.blockIndex);
      case 'getLatestAcknowledgements': return ledger.getLatestAcknowledgements();
      case 'retrieve': return retrieve(ledger, payload);
      case 'navigateByUrl': return this.navigateByUrl(payload);

      // fallback
      default: throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  private async getDocument({ ledgerId, id }: { ledgerId: string; id: string }) {
    const document = await this.documentService.getDocument({ id, ledgerId });
    const content = await this.documentService.getDocumentContent({ ledgerId, document });

    return {
      content,
      contentType: document.contentType,
    };
  }

  private async navigateByUrl(payload: { url: string }) {
    await this.router.navigateByUrl(payload.url);
  }
}
