// import saveAs from 'file-saver';
import saveAs from 'file-saver';
import * as mimedb from 'mime-db';
import { isExportedAndDefined, isRedacted, Redactable } from '@traent/ngx-components';
import { UIPaginationParams } from '@traent/ngx-paginator';

import { LedgerResource, RedactableBox } from '../ledger';
import { DocumentV0 } from '../ledger-objects/models';

export enum DocumentContentType {
  PDF = 'PDF',
  Image = 'Image',
  Generic = 'Generic',
}

export type Document = RedactableBox<DocumentV0> & {
  uiType: Redactable<DocumentContentType>;
  extension: string;
  isContentReadable: boolean;
} & {
  getData: () => Promise<Uint8Array | undefined>;
  getDataUrl: () => Promise<string | undefined>;
} & LedgerResource;

export type DocumentParams = Partial<{
  tagId: string;
  uiType: DocumentContentType[];
}> & UIPaginationParams;

export const DOCUMENT_LABEL = 'DocumentV0';

export const parseDocumentContentType = (mimeType: string): DocumentContentType => {
  const documentContentTypeMappings: { [K in DocumentContentType]: Array<string> } = {
    [DocumentContentType.PDF]: [
      'application/pdf',
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
 * in case of a un-redacted not-placeholder file, or a distinctive string else case.
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

  // temporary workaround for https://traent.atlassian.net/browse/AE-6578
  if (contentType && typeof contentType !== 'string') {
    return 'placeholder';
  }

  const data = mimedb[contentType.toLowerCase()];
  const exts = data?.extensions;
  return exts?.length ? exts[0] : 'unknown';
};

export const downloadDocument = async (document: Document): Promise<void> => {
  const url = await document.getDataUrl();
  const content = await (await fetch(url || 'missing-url')).blob();
  if (!content) {
    return;
  }

  const name = isExportedAndDefined(document.name) ? document.name : Date.now().toString();

  saveAs(new Blob([content]), `${name}${document.extension ? '.' + document.extension : ''}`);
};
