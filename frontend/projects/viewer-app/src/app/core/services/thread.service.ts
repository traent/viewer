import { Injectable } from '@angular/core';
import { isExported } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import {
  Thread,
  ThreadMessage,
  ThreadMessageEntity,
  ThreadMessageParams,
  ThreadParams,
  ThreadReference,
  ThreadReferenceParams,
} from '@viewer/models';

import { LedgerObjectsService, LedgerState } from './ledger-objects.service';
import { collectionSort, collectionToPage, transformerFrom } from '../utils';

export const THREAD_LABEL = 'ThreadV0';
export const THREAD_REFERENCE_LABEL = 'ThreadReferenceV0';
export const THREAD_MESSAGE_LABEL = 'ThreadMessageV0';
export const THREAD_MESSAGE_ENTITY_LABEL = 'ThreadMessageEntityV0';

export const parseThread = (obj: any): Thread => ({ ...obj });

const extractThreadsFromState = (state: LedgerState): Thread[] =>
  transformerFrom(parseThread)(state[THREAD_LABEL]);

const parseThreadReference = (obj: any): ThreadReference => ({ ...obj });

const extractThreadReferencesFromState = (state: LedgerState): ThreadReference[] =>
  transformerFrom(parseThreadReference)(state[THREAD_REFERENCE_LABEL]);

const parseThreadMessageEntities = (obj: any): ThreadMessageEntity => ({ ...obj });

const extractThreadMessageEntitiesFromState = (state: LedgerState): ThreadMessageEntity[] =>
  transformerFrom(parseThreadMessageEntities)(state[THREAD_MESSAGE_ENTITY_LABEL]);

@Injectable({ providedIn: 'root' })
export class ThreadService {

  constructor(private readonly ledgerObjectService: LedgerObjectsService) { }

  async getThreads(params?: ThreadParams): Promise<Page<Thread>> {
    const currentState = await this.ledgerObjectService.getObjects();
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

  async getThread(threadId: string, blockIndex?: number): Promise<Thread> {
    const object = await this.ledgerObjectService.getObject(THREAD_LABEL, threadId, blockIndex);
    return parseThread(object);
  }

  async getThreadMessage(threadMessageId: string, blockIndex?: number): Promise<ThreadMessage> {
    const object = await this.ledgerObjectService.getObject(THREAD_MESSAGE_LABEL, threadMessageId, blockIndex);
    return this.parseThreadMessage(object);
  }

  async getThreadMessages(params?: ThreadMessageParams): Promise<Page<ThreadMessage>> {
    const currentState = await this.ledgerObjectService.getObjects();
    let collection = this.extractThreadMessagesFromState(currentState);

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
    const currentState = await this.ledgerObjectService.getObjects();
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

  async getThreadMessageEntities(threadMessageId: string): Promise<ThreadMessageEntity[]> {
    const currentState = await this.ledgerObjectService.getObjects();
    const collection = extractThreadMessageEntitiesFromState(currentState);

    return collection.filter((threadReference) => threadReference?.threadMessageId === threadMessageId);
  }

  extractThreadMessagesFromState(state: LedgerState): ThreadMessage[] {
    return transformerFrom(this.parseThreadMessage.bind(this))(state[THREAD_MESSAGE_LABEL]);
  }

  private parseThreadMessage(obj: any): ThreadMessage {
    let entities$: Promise<ThreadMessageEntity[]>;
    const message = obj;
    return {
      ...message,
      threadMessageEntities: () => entities$ ??= this.getThreadMessageEntities(message.id),
    };
  };
}
