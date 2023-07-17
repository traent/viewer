import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  FormFillItem,
  getStreamTypeIcon,
  isExportedAndDefined,
  MaterialOrCustomIcon,
  Redactable,
  RedactedMarker,
  RedactedType,
  StreamEntryType,
} from '@traent/ngx-components';
import { isNotNullOrUndefined } from '@traent/ts-utils';
import { ProjectParticipant, RedactableBox } from '@viewer/models';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { UIDocumentFormStreamItem, FormItemType } from '../../../../../core/models/forms';
import { ProjectParticipantService } from '../../../../../core/services/project-participant.service';

const getUIStreamEntryType = (type: StreamEntryType) => type as unknown as StreamEntryType;

const getRedactableStreamTypeIcon = (type: Redactable<StreamEntryType>): MaterialOrCustomIcon | undefined => {
  if (type instanceof RedactedType) {
    return undefined;
  }
  return getStreamTypeIcon(type);
};

type UIFormFillItem = RedactableBox<FormFillItem> & { lastEditor$: RedactedType | Promise<ProjectParticipant> | undefined };

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

  readonly formFillItem$: Observable<UIFormFillItem> = combineLatest([
    this.form$.pipe(isNotNullOrUndefined()),
    this.documentFormItem$.pipe(isNotNullOrUndefined()),
  ]).pipe(
    map(([form, documentFormItem]) => {
      const valueControl = form?.get('value');
      const updatedAt = documentFormItem?.streamEntry?.updatedAt;
      const lastEditorId = documentFormItem.streamEntry?.updaterId;
      return {
        ...documentFormItem,
        value: valueControl?.value || undefined,
        updatedAt: updatedAt || undefined,
        lastEditor$: isExportedAndDefined(lastEditorId)
          ? this.projectParticipantService.getProjectParticipant({ id: lastEditorId })
          : RedactedMarker,
      };
    }),
  );

  readonly getRedactableStreamTypeIcon = getRedactableStreamTypeIcon;
  readonly getUIStreamEntryType = getUIStreamEntryType;

  constructor(private readonly projectParticipantService: ProjectParticipantService) { }

}
