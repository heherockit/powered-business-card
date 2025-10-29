import React, { useEffect, useState } from 'react';
import type { GeneratedCard, RelevantTemplate } from '../../services/cardService';
import { fetchTemplates } from '../../services/templateService';

export interface TemporaryGeneratingResultProps {
  loading?: boolean;
  error?: string | null;
  card?: GeneratedCard | null;
  templates?: RelevantTemplate[] | null;
}

export function TemporaryGeneratingResult({
  loading = false,
  error = null,
  card = null,
  templates = null,
}: TemporaryGeneratingResultProps) {
  // Selected templates enriched with descriptions (preserving original information)
  const [selectedDetails, setSelectedDetails] = useState<{ name: string; description: string }[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    
    async function loadDetails() {
      if (!Array.isArray(templates) || templates.length === 0) {
        setSelectedDetails([]);
        return;
      }
    
      setDetailsLoading(true);
    
      try {
        const all = await fetchTemplates();
    
        const names = new Set(templates.map((t) => t.name));
    
        const selected = all.filter((t) => names.has(t.name));
    
        const details = selected.map((t) => ({ name: t.name, description: t.description ?? '' }));
    
        if (!cancelled) setSelectedDetails(details);
      } catch (err) {
        // Fallback: show names with empty descriptions to maintain two-line structure
        if (!cancelled) setSelectedDetails(templates.map((t) => ({ name: t.name, description: '' })));
      } finally {
        if (!cancelled) setDetailsLoading(false);
      }
    }
    
    loadDetails();
    
    return () => {
      cancelled = true;
    };
  }, [templates]);
  
  const hasContent = !!card || !!error || loading;
  
  if (!hasContent) return null;

  return (
    <div
      className="card p-4 text-left"
      aria-live={loading ? 'polite' : error ? 'assertive' : 'polite'}
      aria-busy={loading ? true : undefined}
      aria-label="Generated result"
      data-testid="temporary-generating-result"
    >
      {/* Loading state: spinner + skeleton rows for temporary display */}
      {loading && (
        <div className="space-y-3" role="status" aria-label="Loading">
          <div className="flex items-center gap-3 text-textSecondary">
            <svg
              className="animate-spin h-5 w-5 text-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
            <span>Generating your card…</span>
          </div>
          {/* Skeleton rows to indicate temporary nature */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded border border-border bg-white p-3 sm:p-4 animate-pulse" aria-hidden="true">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-red-600" role="alert">
          {error}
        </div>
      )}

      {card && (
        <div className="space-y-3">
          {card.title && <h3 className="m-0 text-xl sm:text-2xl font-semibold text-textPrimary">{card.title}</h3>}
          {card.subtitle && <p className="m-0 text-sm sm:text-base text-textSecondary">{card.subtitle}</p>}

          {/* Result rows: Name (label) and Description (value) with clear separation */}
          {Array.isArray(card.fields) && card.fields.length > 0 && (
            <div className="mt-2 space-y-3" role="list" aria-label="Generated fields">
              {card.fields.map((f, idx) => (
                <div
                  key={`${f.label}-${idx}`}
                  role="listitem"
                  className="rounded border border-border bg-white shadow-soft p-3 sm:p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2">
                    {/* Name */}
                    <div className="flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-accent"
                        aria-hidden="true"
                      >
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v10" />
                      </svg>
                      <span className="text-base sm:text-lg font-semibold text-textPrimary">{f.label}</span>
                    </div>
                    {/* Description */}
                    <div className="text-sm sm:text-base text-textSecondary">{f.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {card.notes && (
            <div className="mt-3">
              <div className="text-xs font-semibold text-textSecondary">Notes</div>
              <p className="m-0 whitespace-pre-wrap">{card.notes}</p>
            </div>
          )}

          {/* Suggested templates: revert styling and display as structured two-line rows (name then description) */}
          {Array.isArray(templates) && templates.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-semibold text-textSecondary">Suggested templates</div>
              {/* Loading placeholders while resolving original descriptions */}
              {detailsLoading && (
                <div className="mt-2 space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded border border-border bg-white p-3 sm:p-4 animate-pulse" aria-hidden="true">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              )}
              {!detailsLoading && (
                <div className="mt-2 space-y-3" role="list" aria-label="Suggested templates">
                  {selectedDetails.map((t, idx) => (
                    <div key={`${t.name}-${idx}`} role="listitem" className="rounded border border-border bg-white p-3 sm:p-4">
                      <div className="text-base sm:text-lg font-semibold text-textPrimary">{t.name}</div>
                      <div className="mt-1 text-sm sm:text-base text-textSecondary">{t.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}