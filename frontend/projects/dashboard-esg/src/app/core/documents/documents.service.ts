import { Injectable } from '@angular/core';
import { isExported, isExportedAndDefined, RedactedMarker } from '@traent/ngx-components';
import { Page } from '@traent/ngx-paginator';
import { base64ToU8 } from '@traent/ts-utils';
import { from, switchMap, of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { collectionToPage } from '../collection';
import { LedgerContextService } from '../ledger';
import { TagType } from '../ledger-objects/models';
import { TagsService } from '../tags';
import {
  DocumentParams,
  DOCUMENT_LABEL,
  parseDocumentContentType,
  getContentTypeExtension,
  Document,
  DocumentContentType,
} from './document';

const TAG_NAME_DEFAULT_DOCUMENT = 'ZetaCheck';

@Injectable({
  providedIn: 'root',
})
export class DocumentsService {

  constructor(
    private readonly ledgerContextService: LedgerContextService,
    private readonly tagsService: TagsService,
  ) {
  }

  async getDocumentCollection(params?: DocumentParams): Promise<Page<Document>> {
    let collection = await this.ledgerContextService.getAll(DOCUMENT_LABEL);
    collection = collection.map(this.parseDocument);

    if (params?.uiType) {
      const uiType = params.uiType;
      collection = collection.filter((entry: Document) => {
        const entryUiType = entry.uiType;
        return isExported(entryUiType) && uiType.includes(entryUiType);
      });
    } else {
      // in this dashboard we only need to show PDFs
      const uiType = DocumentContentType.PDF;
      collection = collection.filter((entry: Document) => {
        const entryUiType = entry.uiType;
        return isExported(entryUiType) && uiType.includes(entryUiType);
      });
    }

    if (params?.tagId) {
      const tagEntries = await this.tagsService.getTagEntries({ tagId: params.tagId });
      collection = collection.filter((i: Document) => tagEntries.some((entry) => entry.taggedResourceId === i.id));
    }

    return collectionToPage(
      collection,
      params?.page,
      params?.limit,
    );
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const item = await this.ledgerContextService.retrieve(id);
    return item && this.parseDocument(item);
  }

  async getDocumentByName(name: string): Promise<Document | undefined> {
    let collection = await this.ledgerContextService.getAll(DOCUMENT_LABEL);
    collection = collection.map(this.parseDocument);
    return collection.find((document: any) => document.name === name);
  }

  getDocumentByTag(tagName: string): Observable<Document | undefined> {
    return from(this.tagsService.getTagByName(tagName)).pipe(
      switchMap((tag) => !!tag
        ? from(this.getDocumentCollection({ page: 1, tagId: tag.id })).pipe(
          map((page) => page.items && page.items[0] ? page.items[0] : undefined),
        )
        : of(undefined),
      ),
    );
  }

  getDocumentsByTag(tagName: string): Observable<Document[]> {
    return from(this.tagsService.getTagByName(tagName)).pipe(
      switchMap((tag) => !!tag
        ? from(this.getDocumentCollection({ page: 1, tagId: tag.id })).pipe(
          map((page) => page.items),
        )
        : of([]),
      ),
    );
  }

  async getDocumentOrDefault(id?: string): Promise<Document | undefined> {
    if (id) {
      return this.getDocument(id);
    }

    const tags = await this.tagsService.getTags({ type: TagType.Document });
    const tag = tags.find((t) => t.name === TAG_NAME_DEFAULT_DOCUMENT);
    if (tag) {
      const tagEntries = await this.tagsService.getTagEntries({ tagId: tag.id });
      const documentIds = tagEntries.map(({ taggedResourceId }) => taggedResourceId);
      if (documentIds[0] && typeof documentIds[0] === 'string') {
        return this.getDocument(documentIds[0]);
      }
    }

    const page = await this.getDocumentCollection({ page: 1, limit: 1 });
    return page.items[0];
  }

  parseDocument(document?: any): Document {
    let content: Promise<Uint8Array | undefined> | undefined;
    return {
      ...document,
      getData: () => content ??= isExportedAndDefined(document.offChainedBlockHashes) && isExportedAndDefined(document.length)
        ? this.getDocumentContent(document.length, document.offChainedBlockHashes)
        : Promise.resolve(undefined),
      getDataUrl: () => isExportedAndDefined(document.offChainedBlockHashes) && isExportedAndDefined(document.length)
        ? window[Symbol.virtualHelpers].getDocumentVirtualUrl(document.id)
        : Promise.resolve(undefined),
      uiType: isExportedAndDefined(document.contentType)
        ? parseDocumentContentType(document.contentType)
        : RedactedMarker,
      extension: getContentTypeExtension(document.contentType),
      isContentReadable: isExportedAndDefined(document.length) && document.length > 0
        && isExportedAndDefined(document.offChainedBlockHashes) && document.offChainedBlockHashes.length > 0,
    };
  };

  // Note: this is a temporary solution that needs to be improved in terms of performance
  // eslint-disable-next-line class-methods-use-this
  private async getDocumentContent(size: number, offChains: string[]): Promise<Uint8Array> {
    const content = new Uint8Array(size);
    let offset = 0;

    for (const offchain of offChains) {
      const offChainAddress = base64ToU8(offchain);
      const offChainItem = {} as any; // await this.storageService.getOffchain(offChainAddress);
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
