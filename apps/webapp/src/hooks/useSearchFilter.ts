import { useMemo } from 'react';
import type { TemplateMeta } from '../features/templates/types';

export function useSearchFilter(items: TemplateMeta[], query: string) {
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) => i.name.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
    );
  }, [items, query]);
  return filtered;
}
