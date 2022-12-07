import { isRedacted } from '@traent/ngx-components';
import { Page, UIPaginationParams, UIPaginator } from '@traent/ngx-paginator';

import { LedgerResource } from '../models/ledger-resource';
import { LedgerCollection } from '../services';

export const transformerFrom = <T>(transform: (o: LedgerResource) => T): (c: LedgerCollection) => T[] =>
  (c) => Object.values(c || {}).map((o) => transform(o));

export const collectionToPage = <T>(collection: T[], page = 1, limit?: number): Page<T> => {
  let items = collection;

  if (limit !== undefined) {
    const offset = (page > 0 ? (page - 1) : 0) * limit;
    const end = offset + limit;
    items = items.slice(offset, end);
  }

  return UIPaginator.wrapInPage<T>(items, collection.length, page, limit);
};

export type SortOrder = 'asc' | 'desc';
export interface SortableResource<K, Z = keyof K> { sortOrder?: SortOrder; sortBy?: Z };
export type SortableColumn<K> = SortableResource<K>['sortBy'];
export type LedgerBlockIndex = { ledgerId?: string; blockIndex?: number };

/**
 * `ResourceCollectionParams` is a utility type that groups together all the base types used by the resource services
 * to define the interfaces used as input params used by the methods theat return collections of items.
 */
export type ResourceCollectionParams<K> = LedgerBlockIndex & UIPaginationParams & SortableResource<K>;
/**
 * `ResourceParams` collects the basic standard input params used by the resource services to address a
 * specific resource (getDocument, getStream, ...).
 */
export type ResourceParams = { id: string } & LedgerBlockIndex;

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
