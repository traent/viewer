import { Injectable } from '@angular/core';
import { required } from '@traent/ts-utils';
import { BehaviorSubject } from 'rxjs';

import { AcknowledgementByAuthor, AcknowledgementService } from './acknowledgement.service';
import { LedgerObjectsService, LedgerSnapshot, LedgerState } from './ledger-objects.service';
import { LedgerService } from './ledger.service';
import { StorageService } from './storage.service';
import { BlockAcknowledgementInfo, LedgerResource } from '../models';
import { Ledger } from '../utils/ledger';

import { ChangeFilter, LedgerChange, LedgerObject, ObjectFilter, Page } from '*/well-known/view-v2.js';

export interface ObjectLedger {
  id: string;
  getBlockLedger(): Ledger;

  getObjects(blockIndex?: number): Promise<LedgerState>;
  getObject(type: string, objId: string, blockIndex?: number): Promise<LedgerResource>;
  getHistory(from?: number, to?: number): Promise<LedgerSnapshot[]>;

  getChanges(filter: ChangeFilter): Promise<Page<LedgerChange>>;
  getObjectsV2(filter: ObjectFilter): Promise<Page<LedgerObject>>;

  getAuthorKeyId(authorId: string): string | undefined;
  getAcknowledgementStatus(blockIndex: number): Promise<BlockAcknowledgementInfo>;
  getAcknowledgements(blockIndex: number): Promise<AcknowledgementByAuthor>;
  getLatestAcknowledgements(): Promise<AcknowledgementByAuthor>;
}

@Injectable({ providedIn: 'root' })
export class LedgerAccessorService {
  readonly selectedLedgerId$ = new BehaviorSubject<string | undefined>(undefined);
  get selectedLedgerId() {
    return this.selectedLedgerId$.value;
  }

  /**
   * A BlockLedger is the abstraction of a ledger on a raw level (per-block view)
   * Note: A rename of the original `Ledger` class has been scheduled.
   */
  getBlockLedger(ledgerId = this.requiredSelectedLedgerId) {
    return this.storageService.getLedger(ledgerId);
  }

  /**
   * An ObjectLedger is the abstraction of a ledger considering its ledger objects.
   * It exposes methods to retrieve the objects from a specific ledger providing a
   * to method chain-like interface.
   * Note: A rename of this method is required in order to introduce the `Object`
   * word.
   */
  getLedger(id = this.requiredSelectedLedgerId): ObjectLedger {
    return {
      id,
      getBlockLedger: () => this.getBlockLedger(id),

      getObjects: (blockIndex) => this.ledgerObjectsService.getObjects(id, blockIndex),
      getObject: (type, objId, blockIndex) => this.ledgerObjectsService.getObject(id, type, objId, blockIndex),
      getHistory: (from, to) => this.ledgerObjectsService.getHistory(id, from, to),

      getChanges: (filter) => this.ledgerObjectsService.getChanges(id, filter),
      getObjectsV2: (filter) => this.ledgerObjectsService.getObjectsV2(id, filter),

      getAuthorKeyId: (authorId) => this.acknowledgementService.getAuthorKeyId(id, authorId),
      getAcknowledgements: (blockIndex) => this.acknowledgementService.getAcknowledgements(id, blockIndex),
      getAcknowledgementStatus: (blockIndex) => this.acknowledgementService.getAcknowledgementStatus(id, blockIndex),
      getLatestAcknowledgements: () => this.acknowledgementService.getLatestAcknowledgements(id),
    };
  }

  private get requiredSelectedLedgerId(): string {
    required(this.selectedLedgerId, 'Unexpected access to the active ledger before loading it');
    return this.selectedLedgerId;
  }

  constructor(
    private readonly acknowledgementService: AcknowledgementService,
    private readonly ledgerObjectsService: LedgerObjectsService,
    private readonly storageService: StorageService,
    ledgerService: LedgerService,
  ) {
    ledgerService.reset$.subscribe(() => this.selectLedger(undefined));

    this.storageService.ready$.subscribe(() => {
      const ledger = this.storageService.defaultLedger;
      this.selectLedger(ledger?.id);
    });
  }

  selectLedger(id?: string) {
    this.selectedLedgerId$.next(id);
  }
}
