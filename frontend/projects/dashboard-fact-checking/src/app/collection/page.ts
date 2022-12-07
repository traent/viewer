import { Page, UIPaginator } from '@traent/ngx-paginator';

export const collectionToPage = <T>(collection: T[], page = 1, limit?: number): Page<T> => {
  let items = collection;

  if (limit !== undefined) {
    const offset = (page > 0 ? (page - 1) : 0) * limit;
    const end = offset + limit;
    items = items.slice(offset, end);
  }

  return UIPaginator.wrapInPage<T>(items, collection.length, page, limit);
};
