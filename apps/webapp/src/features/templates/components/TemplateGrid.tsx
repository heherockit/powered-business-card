import { useState } from 'react';
import { templates } from '../data/templates';
import type { TemplateMeta } from '../types';
import { useSearchFilter } from '../../../hooks/useSearchFilter';
import { TextInput } from '../../../components/atoms/Input';
import { TemplateCard } from './TemplateCard';

export function TemplateGrid({ onPick }: { onPick?: (t: TemplateMeta) => void }) {
  const [query, setQuery] = useState('');
  const filtered = useSearchFilter(templates, query);

  return (
    <section className="grid grid-cols-1 gap-4">
      <TextInput
        aria-label="search-templates"
        placeholder="Search templates"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TemplateCard key={t.id} template={t} onSelect={onPick} />
        ))}
      </div>
    </section>
  );
}
