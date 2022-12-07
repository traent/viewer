import { isExportedAndDefined, isRedacted, Redactable } from '@traent/ngx-components';
import { Document } from '@viewer/models';
import { saveAs } from 'file-saver';
import { getDocument } from 'pdfjs-dist';

export const getDocumentProxy = (documentData: Uint8Array) => getDocument(documentData).promise;

export const downloadDocument = async (document: Document, content: Uint8Array): Promise<void> => {
  const name = isExportedAndDefined(document.name) ? document.name : Date.now().toString();
  saveAs(new Blob([content]), `${name}${document.extension ? '.' + document.extension : ''}`);
};

export const getPlaceholderPath = (contentType?: Redactable<string>): string | undefined => {
  if (!contentType || isRedacted(contentType)) {
    return;
  }

  const types = contentType.split('/');
  if (!types || !types.length) {
    return undefined;
  }

  switch (types[0]) {
    case 'application': return '/assets/@traent/design-system/images/document-zip.svg';
    case 'video': return '/assets/@traent/design-system/images/document-video.svg';
    case 'audio': return '/assets/@traent/design-system/images/document-audio.svg';
    case 'text': return '/assets/@traent/design-system/images/document-code.svg';
    // case 'image':  FIXME, design a placeholder
    default: return undefined;
  }
};
