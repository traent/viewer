import { getDocument } from 'pdfjs-dist';

export const getDocumentProxyFromArrayBuffer = (arrayBuffer: ArrayBuffer): Promise<any> => {
  const typedArray = new Uint8Array(arrayBuffer);
  return getDocument(typedArray).promise;
};

export const getDocumentProxyFromUrl = (url: string): Promise<any> => getDocument(url).promise;
