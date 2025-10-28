import { useState } from 'react';
import { templates } from '../data/templates';
import type { TemplateMeta } from '../types';
import { useSearchFilter } from '../../../hooks/useSearchFilter';
import { TextInput } from '../../../components/atoms/Input';
import { TemplateCard } from './TemplateCard';

export function TemplateGrid({ onPick }: { onPick?: (t: TemplateMeta) => void }) {
  // Uncommitted text in the input
  const [query, setQuery] = useState('');
  // Committed search term applied when clicking the icon or pressing Enter
  const [searchTerm, setSearchTerm] = useState('');
  const filtered = useSearchFilter(templates, searchTerm);

  const onSearch = () => {
    setSearchTerm(query.trim());
  };

  return (
    <section className="grid grid-cols-1 gap-4">
      <div className="relative">
        <TextInput
          aria-label="search-templates"
          placeholder="Search templates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onSearch();
            }
          }}
          className="pr-10"
        />
        <button
          type="button"
          aria-label="Search templates"
          onClick={onSearch}
          className="absolute inset-y-0 right-2 my-auto h-8 w-8 flex items-center justify-center text-gray-600 hover:text-gray-900 focus-ring transition"
          title="Search"
        >
          {/* Design-system compliant search icon (stroke currentColor) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => (
          <TemplateCard key={t.id} template={t} onSelect={onPick} />
        ))}
      </div>
    </section>
  );
}
