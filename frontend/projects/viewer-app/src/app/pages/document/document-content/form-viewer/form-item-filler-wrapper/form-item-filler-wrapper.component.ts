import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FormFillItem,
  MaterialOrCustomIcon,
  Redactable,
  RedactedType,
  StreamEntryType,
  getStreamTypeIcon,
} from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { RedactableBox } from '@viewer/models';

import { UIDocumentFormStreamItem, FormItemType } from '../../../../../core/models/forms';

const getUIStreamEntryType = (type: StreamEntryType) => type as unknown as StreamEntryType;

const getRedactableStreamTypeIcon = (type: Redactable<StreamEntryType>): MaterialOrCustomIcon | undefined => {
  if (type instanceof RedactedType) {
    return undefined;
  }
  return getStreamTypeIcon(type);
};

@Component({
  selector: 'app-form-item-filler-wrapper',
  templateUrl: './form-item-filler-wrapper.component.html',
  styleUrls: ['./form-item-filler-wrapper.component.scss'],
})
export class FormItemFillerWrapperComponent {

  @Input() viewMode$ = new BehaviorSubject<'current' | 'historic' | undefined>(undefined);
  @Input() set viewMode(mode: 'current' | 'historic') {
    this.viewMode$.next(mode);
  };

  @Input() form$ = new BehaviorSubject<FormGroup<FormItemType> | undefined>(undefined);
  @Input() set form(form: FormGroup) {
    this.form$.next(form);
  }
  @Input() documentFormItem$ = new BehaviorSubject<UIDocumentFormStreamItem | undefined>(undefined);
  @Input() set documentFormItem(documentFormItem: UIDocumentFormStreamItem) {
    this.documentFormItem$.next(documentFormItem);
  }

  readonly formFillItem$: Observable<RedactableBox<FormFillItem>> = combineLatest([
    this.form$.pipe(isNotNullOrUndefined()),
    this.documentFormItem$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    map(([form, documentFormItem]) => {
      const valueControl = form?.get('value');
      const updatedAt = documentFormItem?.streamEntry?.updatedAt;
      return {
        ...documentFormItem,
        value: valueControl?.value || undefined,
        updatedAt: updatedAt || undefined,
      };
    }),
  );

  readonly getRedactableStreamTypeIcon = getRedactableStreamTypeIcon;
  readonly getUIStreamEntryType = getUIStreamEntryType;

}
