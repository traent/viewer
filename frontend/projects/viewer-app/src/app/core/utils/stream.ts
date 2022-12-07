import { MaterialOrCustomIcon } from '@traent/ngx-components';
import { StreamEntryType } from '@viewer/models';

export const printableStreamTypes: Record<Exclude<StreamEntryType, 'custom'>, string> = {
  ['boolean']: 'checkbox',
  currency: 'currency',
  date: 'date',
  dropdown: 'select',
  json: 'JSON',
  ['number']: 'numeric value',
  ['multi-select']: 'multi select',
  text: 'text',
  uri: 'website URL',
};

export const getStreamTypeIcon = (type: StreamEntryType): MaterialOrCustomIcon => {
  switch (type) {
    case 'date':
      return { material: 'calendar_today' };
    case 'number':
      return { material: 'tag' };
    case 'multi-select':
      return { material: 'checklist' };
    case 'text':
      return { material: 'text_fields' };
    case 'currency':
      return { material: 'euro_symbol' };
    case 'boolean':
      return { custom: 'checkbox' };
    case 'dropdown':
      return { material: 'reorder' };
    case 'uri':
      return { material: 'language' };
    case 'json':
      return { custom: 'code' };
  }
  return { custom: 'code' };
};

export const streamLabelTranslationKeyMap: Record<StreamEntryType, string> = {
  ['boolean']: 'i18n.StreamEntryType.boolean',
  currency: 'i18n.StreamEntryType.currency',
  custom: 'i18n.StreamEntryType.custom',
  date: 'i18n.StreamEntryType.date',
  ['number']: 'i18n.StreamEntryType.number',
  ['multi-select']: 'i18n.StreamEntryType.multiSelect',
  text: 'i18n.StreamEntryType.text',
  uri: 'i18n.StreamEntryType.uri',
  dropdown: 'i18n.StreamEntryType.dropdown',
  json: 'i18n.StreamEntryType.json',
};

export const getStreamTypeTranslationKey = (type: string): string => (streamLabelTranslationKeyMap as Record<string, string>)[type];
