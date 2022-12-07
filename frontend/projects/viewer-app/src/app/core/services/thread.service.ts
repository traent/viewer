import { Injectable } from '@angular/core';
import { isExported } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import {
  Thread,
  ThreadMessage,
  ThreadMessageEntity,
  ThreadMessageEntityParams,
  ThreadMessageParams,
  ThreadParams,
  ThreadReference,
  ThreadReferenceParams,
} from '@viewer/models';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { collectionSort, collectionToPage, ResourceParams, transformerFrom } from '../utils';

export const THREAD_LABEL = 'ThreadV0';
export const THREAD_REFERENCE_LABEL = 'ThreadReferenceV0';
export const THREAD_MESSAGE_LABEL = 'ThreadMessageV0';
export const THREAD_MESSAGE_ENTITY_LABEL = 'ThreadMessageEntityV0';

export const parseThread = (obj: any): Thread => ({ ...obj });
const extractThreadsFromState = (state: LedgerState): Thread[] => transformerFrom(parseThread)(state[THREAD_LABEL]);

const parseThreadReference = (obj: any): ThreadReference => ({ ...obj });
const extractThreadReferencesFromState = (state: LedgerState): ThreadReference[] =>
  transformerFrom(parseThreadReference)(state[THREAD_REFERENCE_LABEL]);

const parseThreadMessageEntities = (obj: any): ThreadMessageEntity => ({ ...obj });
const extractThreadMessageEntitiesFromState = (state: LedgerState): ThreadMessageEntity[] =>
  transformerFrom(parseThreadMessageEntities)(state[THREAD_MESSAGE_ENTITY_LABEL]);

const parseThreadMessage = (obj: any): ThreadMessage => obj as ThreadMessage;
export const extractThreadMessagesFromState = (state: LedgerState): ThreadMessage[] =>
  transformerFrom(parseThreadMessage)(state[THREAD_MESSAGE_LABEL]);

@Injectable({ providedIn: 'root' })
export class ThreadService {

  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getThreads(params?: ThreadParams): Promise<Page<Thread>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractThreadsFromState(currentState);

    if (params?.isResolved !== undefined) {
      collection = collection.filter((thread) => isExported(thread.isResolved) && thread.isResolved === params.isResolved);
    }

    if (params?.documentId) {
      const threadReferences = extractThreadReferencesFromState(currentState);
      const threadIds = threadReferences
        .filter((threadReference) => threadReference?.documentId === params.documentId)
        .map((threadReference) => threadReference.threadId);
      collection = collection.filter((thread) => threadIds.includes(thread.id));
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'createdAt', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  async getThread({ id, blockIndex, ledgerId }: ResourceParams): Promise<Thread> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(THREAD_LABEL, id, blockIndex);
    return parseThread(object);
  }

  async getThreadMessage({ id, blockIndex, ledgerId }: ResourceParams): Promise<ThreadMessage> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(THREAD_MESSAGE_LABEL, id, blockIndex);
    return parseThreadMessage(object);
  }

  async getThreadMessages(params?: ThreadMessageParams): Promise<Page<ThreadMessage>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractThreadMessagesFromState(currentState);

    if (params?.threadId) {
      collection = collection.filter((threadMessage) => threadMessage?.threadId === params.threadId);
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'createdAt', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  async getThreadReferences(params?: ThreadReferenceParams): Promise<Page<ThreadReference>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractThreadReferencesFromState(currentState);

    if (params?.threadId) {
      collection = collection.filter((threadReference) =>
        isExported(threadReference.threadId) && threadReference?.threadId === params.threadId);
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'createdAt', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  async getThreadMessageEntities(params?: ThreadMessageEntityParams): Promise<ThreadMessageEntity[]> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractThreadMessageEntitiesFromState(currentState);

    if (params?.threadMessageId) {
      collection = collection.filter((threadReference) => threadReference.threadMessageId === params.threadMessageId);
    }

    return collectionSort(collection, params?.sortBy || 'updatedAt', params?.sortOrder);
  }
}
