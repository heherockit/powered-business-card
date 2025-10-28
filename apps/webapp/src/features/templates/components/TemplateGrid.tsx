import { useEffect, useState } from 'react';
import type { TemplateMeta } from '../types';
import { useSearchFilter } from '../../../hooks/useSearchFilter';
import { TextInput } from '../../../components/atoms/Input';
import { TemplateCard } from './TemplateCard';
import { fetchTemplates } from '../../../services/templateService';

export function TemplateGrid({ onPick }: { onPick?: (t: TemplateMeta) => void }) {
  // Uncommitted text in the input
  const [query, setQuery] = useState('');
  // Committed search term applied when clicking the icon or pressing Enter
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState<TemplateMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchTemplates();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setError('Failed to load templates. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useSearchFilter(items, searchTerm);

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
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-40 bg-gray-200" />
              <div className="h-5 bg-gray-200 m-3 rounded" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="card p-4 text-left">
          <div className="text-red-600 font-medium">{error}</div>
          <button
            type="button"
            className="btn mt-3"
            onClick={() => {
              setSearchTerm('');
              setLoading(true);
              setError(null);
              fetchTemplates()
                .then((data) => setItems(data))
                .catch(() => setError('Failed to load templates. Please try again.'))
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((t) => (
            <TemplateCard key={`${t.name}-${t.imagePreview}`} template={t} onSelect={onPick} />
          ))}
        </div>
      )}
    </section>
  );
}
