import { AbstractControl, FormGroup } from '@angular/forms';
import { DocumentFormStreamItem, DocumentFormContentItem, Redactable, getStreamTypeIcon } from '@traent/ngx-components';
import { getStreamTypeTranslationKey } from '@viewer/utils';

import { RedactableBox } from './ledger-resource';
import { StreamEntry, StreamReference } from './stream';

export type UIDocumentFormStreamItem = RedactableBox<DocumentFormStreamItem> & { required?: boolean; streamEntry?: StreamEntry };

export type UIDocumentFormItem = {
  kind: 'stream';
  value: Redactable<UIDocumentFormStreamItem>;
} | {
  kind: 'content';
  value: DocumentFormContentItem;
};

export type UIDocumentForm = { id: string; name: string; items: UIDocumentFormItem[] };

export type FormType = {
  [id: string]: FormGroup<FormItemType>;
};

export type FormItemType = {
  id: AbstractControl<string | null>;
  value: AbstractControl<any>;
  configuration?: AbstractControl<any>;
};

export interface ViewDocumentForm {
  documentId: string;
  uiDocumentForm: UIDocumentForm;
  form: FormGroup<FormType>;
  /** Items defined in the document content but not present as references */
  deletedReferences: DocumentFormStreamItem[];
  /** Items present as references (with anchor of type Form) but not in the document content (inconsistent state) */
  otherReferences: StreamReference[];
}

export const getDocumentFormItemTypeIcon = (x: string) => x === 'heading' ?  { custom: 'heading' } : getStreamTypeIcon(x);

export const getDocumentFormItemTypeTranslationKey =
  (x: string) => x === 'heading' ? 'i18n.Document.Form.heading' : getStreamTypeTranslationKey(x);
