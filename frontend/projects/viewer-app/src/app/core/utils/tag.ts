import { TagType } from '@ledger-objects';
import { LogItemImage } from '@viewer/models';
import { Redactable } from '@traent/ngx-components';

export const getTagTypeLabel = (type?: Redactable<TagType>): string => {
  switch (type) {
    case TagType.Stream: return 'class';
    case TagType.Participant: return 'group';
    case TagType.Document: return 'tag';
    // Note: this happens when the tag type has been redacted
    default: return 'redacted tag type';
  }
};

export const getTagImage = (type?: Redactable<TagType>): LogItemImage => type === TagType.Stream
  ? {
    type: 'icon',
    icon: { custom: 'stream-overview' },
    bgColor: 'opal-bg-blue-100',
    textColor: 'opal-text-blue-600',
  }
  : {
    type: 'icon',
    bgColor: 'opal-bg-grey-100',
    textColor: 'opal-text-grey-500',
    icon: type === TagType.Document
      ? { material: 'insert_drive_file' }
      : type === TagType.Participant
        ? { material: 'groups' }
        : { material: 'question_mark' },
  };
