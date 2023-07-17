import { Injectable } from '@angular/core';
import { isExported, isExportedAndDefined, isRedacted, isRedactedOrUndefined, Redactable, RedactedMarker } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import * as mimedb from 'mime-db';
import { defer, Observable } from 'rxjs';

import { LedgerAccessorService } from './ledger-accessor.service';
import { LedgerState } from './ledger-objects.service';
import { Document, DocumentContentType, DocumentParams } from '../models';
import { collectionSort, collectionToPage, Ledger, ResourceParams, transformerFrom, u8ToU8 } from '../utils';

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
      'video/x-matroska',
      'video/x-ms-asf',
      'video/x-ms-wmv',
      'video/x-msvideo',
    ],
    [DocumentContentType.View]: [
      'application/vnd.traent.view+zip',
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
export const getContentTypeExtension = (contentType?: Redactable<string>): string => {
  if (contentType === undefined) {
    return 'placeholder';
  }

  if (isRedacted(contentType)) {
    return 'redacted';
  }

  if (contentType === 'application/vnd.traent.form+json') {
    return 'form';
  }

  if (contentType === 'application/vnd.traent.view+zip') {
    return 'view';
  }

  const data = mimedb[contentType.toLowerCase()];
  const exts = data?.extensions;
  return exts?.length ? exts[0] : 'unknown';
};

export type DocumentSupplier<T> = T & { document$: Observable<Document | undefined> };

const retrieveDocumentContent = async (ledger: Ledger, size: number, offChains: DotNet.InputByteArray[]): Promise<Uint8Array> => {
  const content = new Uint8Array(size);
  let offset = 0;

  for (const offchain of offChains) {
    const offChainAddress = u8ToU8(offchain);
    const offChainItem = await ledger.getOffchain(offChainAddress);
    if (!offChainItem) {
      throw new Error(`Offchain item ${offChainAddress} not found`);
    }

    const offChainContent = await offChainItem.getDecrypted();

    content.set(offChainContent, offset);
    offset += offChainContent.length;
  }

  return content;
};

export const parseDocument = (document: any): Document => {
  const isContentReadable = isExportedAndDefined(document.length) && document.length > 0
    && isExportedAndDefined(document.offChainedBlockHashes) && document.offChainedBlockHashes.length > 0;

  return {
    ...document,
    uiType: isExportedAndDefined(document.contentType)
      ? parseDocumentContentType(document.contentType)
      : RedactedMarker,
    extension: getContentTypeExtension(document.contentType),
    isContentReadable,
  };
};

const extractDocumentFromState = (state: LedgerState): Document[] =>
  transformerFrom(parseDocument)(state[DOCUMENT_LABEL]);

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private readonly ledgerAccessorService: LedgerAccessorService) { }

  async getDocument({ id, blockIndex, ledgerId }: ResourceParams): Promise<Document> {
    const ledger = this.ledgerAccessorService.getLedger(ledgerId);
    const object = await ledger.getObject(DOCUMENT_LABEL, id, blockIndex);
    return parseDocument(object);
  }

  async getDocumentCollection(params?: DocumentParams): Promise<Page<Document>> {
    const ledger = this.ledgerAccessorService.getLedger(params?.ledgerId);
    const currentState = await ledger.getObjects(params?.blockIndex);
    let collection = extractDocumentFromState(currentState);

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
        ? this.getDocument({ id: item.documentId })
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

  /**
   * `getDocumentContent` is a wrapper method to retrieve the document content starting from the resource itself
   *
   * Note: it would be great to have a way not to explicitly pass the `ledgerId`
   */
  getDocumentContent(params: { ledgerId?: string; document: Document }): Promise<Uint8Array> {
    if (isRedactedOrUndefined(params.document.length) || isRedactedOrUndefined(params.document.offChainedBlockHashes)) {
      throw new Error(`Document ${params.document.id}'s length or offchain addresses are redacted`);
    }

    const ledger = this.ledgerAccessorService.getBlockLedger(params.ledgerId);
    return retrieveDocumentContent(ledger, params.document.length, params.document.offChainedBlockHashes);
  }
}
