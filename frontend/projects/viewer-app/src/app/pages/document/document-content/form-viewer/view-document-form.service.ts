import { Injectable } from '@angular/core';
import {
  Validators,
  FormGroup,
  FormBuilder,
} from '@angular/forms';
import {
  DocumentForm,
  DocumentFormStreamItem,
  RedactedMarker,
  StreamEntryType,
  isExported,
  isRedacted,
  maxDate,
  minDate,
  urlValidator,
} from '@traent/ngx-components';
import { required } from '@traent/ts-utils';
import { StreamEntry, StreamReference, RedactableBox } from '@viewer/models';
import { DocumentService } from '@viewer/services';

import {
  UIDocumentFormItem,
  UIDocumentForm,
  ViewDocumentForm,
  FormItemType,
  FormType,
} from '../../../../core/models/forms';

export const getFormStreamValue = (streamEntry: StreamEntry, itemForm: RedactableBox<DocumentFormStreamItem>) => {
  if (streamEntry.type === StreamEntryType.Json && itemForm.required && isExported(streamEntry.value) && !streamEntry.value) {
    // the json-editor displays absent values as empty json objects. This cause required validation error even tough the
    //   UI is correct. This patch aligns the state and UI at least.
    return {};
  }
  return streamEntry.value;
};

const findUIStreamReference = (refId: string, streamReferences: StreamReference[]): StreamReference | undefined =>
  streamReferences.find((streamReference) => isExported(streamReference)
    && isExported(streamReference.anchor) && streamReference.anchor.type === 'form' && streamReference.anchor.refId === refId);

@Injectable({ providedIn: 'root'})
export class ViewDocumentFormService {

  constructor(
    private readonly documentService: DocumentService,
    private readonly formBuilder: FormBuilder,
  ) { }

  public async viewForm(
    documentId: string,
    mode: 'current' | 'historic',
    streamReferences: StreamReference[],
    blob: Blob,
  ): Promise<ViewDocumentForm> {

    const data = await blob.text();
    const documentForm: DocumentForm = JSON.parse(data) as DocumentForm;

    const deletedItemsId: string[] = [];
    let existentItems: UIDocumentFormItem[] = [];

    if (mode === 'current') {
      for (const item of documentForm.items) {
        switch (item.type) {
          case 'heading': {
            existentItems.push({ kind: 'content', value: { ...item } });
            break;
          }
          default: {
            const streamReference = findUIStreamReference(item.id, streamReferences);
            if (streamReference) {
              try {
                const streamEntry = await streamReference.streamEntry();
                if (streamEntry) {
                  if (isExported(streamEntry)) {
                    existentItems.push({
                      kind: 'stream',
                      value: {
                        ...item,
                        streamEntry,
                        name: streamEntry.name,
                        description: streamEntry.description,
                        configuration: streamEntry.configuration,
                      },
                    });
                  } else {
                    existentItems.push({ kind: 'stream', value: RedactedMarker });
                  }
                }
              } catch {
                deletedItemsId.push(item.id);
              }
            } else {
              deletedItemsId.push(item.id);
            }
          }
        }
      }
    } else {
      existentItems = documentForm.items.map((item) => item.type === 'heading'
        ? { kind: 'content', value: item }
        : { kind: 'stream', value: item },
      );
    }

    // Build the FillForm object
    const form = this.formBuilder.group<FormType>({});
    const items: UIDocumentFormItem[] = [];
    const deletedReferences: DocumentFormStreamItem[] = [];
    for (const item of existentItems) {

      switch (item.kind) {
        case 'content':
          items.push(item);
          break;
        case 'stream':
          if (isRedacted(item.value)) {
            items.push(item);
          } else {
            const streamReference = findUIStreamReference(item.value.id, streamReferences);
            required(streamReference);
            const streamEntry = await streamReference.streamEntry();
            required(streamEntry);
            form.addControl(item.value.id, await this.buildFillControl(item.value, streamEntry));
            items.push(item);
          }
          break;
        default:
      }
    }

    const uiDocumentForm: UIDocumentForm = { ...documentForm, items };
    const fillDocument = {
      documentId,
      form,
      documentForm,
      uiDocumentForm,
      deletedReferences,
      otherReferences: [],
    };
    return fillDocument;
  }

  private async buildFillControl(item: RedactableBox<DocumentFormStreamItem>, streamEntry?: StreamEntry): Promise<FormGroup<FormItemType>> {

    const type = streamEntry ? streamEntry.type : item.type;
    const value = streamEntry ? getFormStreamValue(streamEntry, item) : undefined;
    const configuration = streamEntry ? streamEntry.configuration : item.configuration;

    const form = this.formBuilder.group<FormItemType>({
      id: this.formBuilder.control(item.id),
      value: this.formBuilder.control(value, item.required ? [Validators.required] : []),
    });

    switch (type) {
      case StreamEntryType.Uri:
        form.get('value')?.addValidators([urlValidator()]);
        break;
      case StreamEntryType.Dropdown: {
        const allowedValues: string[] = configuration?.allowedValues || [];
        form.addControl('configuration', this.formBuilder.group({
          allowedValues: this.formBuilder.array(allowedValues.map((v) => this.formBuilder.control(v, Validators.required))),
        }));
        break;
      }
    }

    // set validation
    const validator = configuration.validator;
    if (validator) {
      switch (type) {
        case StreamEntryType.Date:
          if (validator.min) {
            form.get('value')?.addValidators([minDate(new Date(validator.min))]);
          }
          if (validator.max) {
            form.get('value')?.addValidators([maxDate(new Date(validator.max))]);
          }
          break;
        default:
          if (validator.max !== undefined) {
            form.get('value')?.addValidators([Validators.max(validator.max)]);
          }
          if (validator.min !== undefined) {
            form.get('value')?.addValidators([Validators.min(validator.min)]);
          }
          if (validator.maxLength !== undefined) {
            form.get('value')?.addValidators([Validators.maxLength(+validator.maxLength)]);
          }
          if (validator.minLength !== undefined) {
            form.get('value')?.addValidators([Validators.minLength(+validator.minLength)]);
          }
          if (validator.pattern !== undefined) {
            form.get('value')?.addValidators([Validators.pattern(validator.pattern)]);
          }
          if (validator.type === 'email') {
            form.get('value')?.addValidators([Validators.email]);
          }
      }
      form.updateValueAndValidity();
    }
    return form;
  }

}
