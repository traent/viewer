import { isExportedAndDefined } from '@traent/ngx-components';
import { DocumentReferencesMap, ReferenceItem } from '@viewer/models';

export const referencesByDoc = (references: Array<ReferenceItem | null>): Array<DocumentReferencesMap> => {
  const obj: { [key: string]: DocumentReferencesMap } = {};

  for (const reference of references) {
    if (!!reference && isExportedAndDefined(reference.documentId)) {
      if (reference.documentId in obj) {
        obj[reference.documentId].refs.push(reference);
      } else {
        obj[reference.documentId] = {
          documentId: reference.documentId,
          refs: [reference],
        };
      }
    }
  }
  return Object.values(obj);
};
