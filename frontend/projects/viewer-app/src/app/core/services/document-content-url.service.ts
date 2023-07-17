import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { LedgerAccessorService } from './ledger-accessor.service';
import { ServiceWorkerService } from './service-worker.service';

@Injectable({ providedIn: 'root' })
export class DocumentContentUrlService {
  constructor(
    private readonly ledgerAccessorService: LedgerAccessorService,
    private readonly serviceWorkerService: ServiceWorkerService,
  ) { }

  getDocumentContentUrl(params: { id: string; ledgerId?: string; subResource?: string }) {
    // TODO: support block index
    const ledgerId = this.ledgerAccessorService.getLedger(params.ledgerId).id;
    const parts = [ledgerId, params.id];
    if (params.subResource) {
      parts.push(params.subResource);
    }
    const suffix = parts.join('/');

    return this.serviceWorkerService.clientId$.pipe(
      map((clientId) => `/virtual/${clientId}/doc/${suffix}`),
    );
  }
}
