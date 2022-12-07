import { Page, UIPaginator } from '@traent/ngx-paginator';

export const fromPascalCaseToKebabCase = (text: string) => text
  .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
  .replace(/([A-Z])([A-Z])(?=[a-z])/g, '$1-$2')
  .toLowerCase();

export const emptyIdentityExtractorPaginator = <T>(fetch: (page: number) => Promise<Page<T>>, skeletonItems?: number) => new UIPaginator(
  fetch,
  (oldItems) => [...oldItems, ...Array(skeletonItems || 20).fill(null)],
  (oldItems, newItems) => [...oldItems.filter((i) => !!i), ...newItems],
  (x) => x,
);

export const memoize = <K, V>(f: (key: K) => V) => {
  const map = new Map<K, V>();
  return (key: K) => {
    const found = map.get(key);
    if (found) {
      return found;
    } else {
      const created = f(key);
      map.set(key, created);
      return created;
    }
  };
};
