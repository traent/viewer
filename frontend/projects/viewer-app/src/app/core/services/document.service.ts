import { Injectable } from '@angular/core';
import { Page } from '@traent/ngx-paginator';
import * as mimedb from 'mime-db';
import { isExported, isExportedAndDefined, isRedacted, Redactable, RedactedMarker } from '@traent/ngx-components';
import { Observable, defer } from 'rxjs';

import { LedgerObjectsService, LedgerState } from './ledger-objects.service';
import { base64ToU8, collectionSort, collectionToPage, transformerFrom } from '../utils';
import { Document, DocumentContentType, DocumentParams } from '../models';
import { StorageService } from './storage.service';

export const DOCUMENT_LABEL = 'DocumentV0';

export const parseDocumentContentType = (mimeType: string): DocumentContentType => {
  const documentContentTypeMappings: { [K in DocumentContentType]: Array<string> } = {
    [DocumentContentType.PDF]: [
      'application/pdf',
    ],
    [DocumentContentType.FORM]: [
      'application/vnd.traent.form+json',
    ],
    [DocumentContentType.Image]: [
      'image/jpeg',
      'image/bmp',
      'image/png',
      'image/apng',
      'image/gif',
      'image/webp',
    ],
    [DocumentContentType.Generic]: [],
    [DocumentContentType.Video]: [
      'video/3gpp',
      'video/mp4',
      'video/avi',
      'video/mpeg',
      'video/quicktime',
      'video/webm',
      'video/x-flv',
      'video/x-m4v',
      'video/x-ms-asf',
      'video/x-ms-wmv',
      'video/x-msvideo',
    ],
  };

  const keys = Object.keys(documentContentTypeMappings);
  for (const key of keys as Array<keyof typeof DocumentContentType>) {
    if (documentContentTypeMappings[key].includes(mimeType)) {
      return DocumentContentType[key];
    }
  }
  return DocumentContentType.Generic;
};

/**
 * Extension is the string used to identify the document type. Its value is related to the file mimetype
 * in case of a unredacted not-placeholder file, or a distinctive string elsecase.
 *
 * Note: the extension is always supposed to be defined.
 */
export const getContentTypeExtention = (contentType?: Redactable<string>): string => {
  if (contentType === undefined) {
    return 'placeholder';
  }

  if (isRedacted(contentType)) {
    return 'redacted';
  }

  if (contentType === 'application/vnd.traent.form+json') {
    return 'form';
  }

  const data = mimedb[contentType.toLowerCase()];
  const exts = data?.extensions;
  return exts?.length ? exts[0] : 'unknown';
};

export type DocumentSupplier<T> = T & { document$: Observable<Document | undefined> };

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(
    private readonly ledgerObjectService: LedgerObjectsService,
    private readonly storageService: StorageService,
  ) { }

  async getDocument(id: string, blockIndex?: number): Promise<Document> {
    const object = await this.ledgerObjectService.getObject(DOCUMENT_LABEL, id, blockIndex);
    return this.parseDocument(object);
  }

  async getDocumentCollection(params?: DocumentParams): Promise<Page<Document>> {
    const currentState = await this.ledgerObjectService.getObjects();
    let collection = this.extractDocumentFromState(currentState);

    if (params?.uiType) {
      const uiType = params.uiType;
      collection = collection.filter((entry) => {
        const entryUiType = entry.uiType;
        return isExported(entryUiType) && uiType.includes(entryUiType);
      });
    }

    return collectionToPage(
      collectionSort(collection, params?.sortBy || 'name', params?.sortOrder),
      params?.page,
      params?.limit,
    );
  }

  getDocumentSupplierCollection<T extends { documentId?: Redactable<string> }>(collections: T[]): DocumentSupplier<T>[] {
    const items: DocumentSupplier<T>[] = collections.map((item) => ({
      ...item,
      document$: defer(() => isExportedAndDefined(item.documentId)
        ? this.getDocument(item.documentId)
        : Promise.resolve(undefined),
      ),
    }));
    return items;
  }

  getDocumentSupplierPage<T extends { documentId?: Redactable<string> }>(collections: Page<T>): Page<DocumentSupplier<T>> {
    return {
      items: this.getDocumentSupplierCollection(collections.items),
      page: collections.page,
      total: collections.total,
    };
  }

  private extractDocumentFromState(state: LedgerState): Document[] {
    return transformerFrom(this.parseDocument.bind(this))(state[DOCUMENT_LABEL]);
  }

  parseDocument(document: any): Document {
    let content: Promise<Uint8Array | undefined> | undefined;
    const isContentReadable =  isExportedAndDefined(document.length) && document.length > 0
      && isExportedAndDefined(document.offChainedBlockHashes) && document.offChainedBlockHashes.length > 0;

    return {
      ...document,
      getData: () => content ??= isContentReadable
        ? this.getDocumentContent(document.length, document.offChainedBlockHashes)
        : Promise.resolve(undefined),
      uiType: isExportedAndDefined(document.contentType)
        ? parseDocumentContentType(document.contentType)
        : RedactedMarker,
      extension: getContentTypeExtention(document.contentType),
      isContentReadable,
    };
  };

  // Note: this is a temporary solution that needs to be improved in terms of performance
  private async getDocumentContent(size: number, offChains: string[]): Promise<Uint8Array> {
    const content = new Uint8Array(size);
    let offset = 0;

    for (const offchain of offChains) {
      const offChainAddress = base64ToU8(offchain);
      const offChainItem = await this.storageService.getOffchain(offChainAddress);
      if (!offChainItem) {
        throw new Error(`Offchain item ${offChainAddress} not found`);
      }

      const offChainContent = await offChainItem.getDecrypted();

      content.set(offChainContent, offset);
      offset += offChainContent.length;
    }

    return content;
  }
}
