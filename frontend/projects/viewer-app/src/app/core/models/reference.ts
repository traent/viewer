import { Redactable } from '@traent/ngx-components';

export interface ReferenceItem {
  anchor?: {
    pageNumber: number;
  };
  documentId?: Redactable<string>;
  id: string;
};

export type DocumentReferencesMap = {
  documentId: Redactable<string>;
  refs: ReferenceItem[];
};
