import { isRedacted } from '@traent/ngx-components';
import { Page, UIPaginator } from '@traent/ngx-paginator';

import { LedgerCollection } from '../services';

export const transformerFrom = <T>(transform: (o: unknown) => T): (c: LedgerCollection) => T[] =>
  (c) => Object.values(c || {}).map(transform);

export const collectionToPage = <T>(collection: T[], page = 1, limit?: number): Page<T> => {
  let items = collection;

  if (limit !== undefined) {
    const offset = (page > 0 ? (page - 1) : 0) * limit;
    const end = offset + limit;
    items = items.slice(offset, end);
  }

  return UIPaginator.wrapInPage<T>(items, collection.length, page, limit);
};

export type BlockIndexed = Partial<{ blockIndex: number }>;

export type SortOrder = 'asc' | 'desc';
export type SortableColumn<K> = SortableResource<K>['sortBy'];
export interface SortableResource<K, Z = keyof K> { sortOrder?: SortOrder; sortBy?: Z };
export const collectionSort = <T>(collection: T[], sortBy: keyof T | ((v: T) => any), order: SortOrder = 'asc'): T[] =>
  typeof sortBy === 'function'
    ? collectionSortSimple(collection, sortBy, order)
    : collectionSortSimple(collection, (v) => v[sortBy] || '', order);

const collectionSortSimple = <T>(collection: T[], sortBy: (v: T) => any, order: SortOrder = 'asc'): T[] =>
  collection.sort((a, b) => {
    const aVal = !isRedacted(sortBy(a)) ? sortBy(a) : 0;
    const bVal = !isRedacted(sortBy(b)) ? sortBy(b) : 0;

    if (aVal < bVal) {
      return order === 'asc' ? -1 : 1;
    }
    if (aVal > bVal) {
      return order === 'asc' ? 1 : -1;
    } else {
      return 0;
    }
  });
