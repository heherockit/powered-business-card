import type { TemplateMeta } from '../types';

export function TemplateCard({
  template,
  onSelect,
}: {
  template: TemplateMeta;
  onSelect?: (t: TemplateMeta) => void;
}) {
  const accent = template.accent;
  return (
    <button
      onClick={() => onSelect?.(template)}
      aria-label={`template-${template.id}`}
      className="grid grid-rows-[auto_1fr] gap-2 w-full text-left p-4 rounded-md border text-textPrimary transition hover:-translate-y-0.5"
      style={{
        borderColor: `${accent}80`,
        background: `linear-gradient(135deg, ${accent}25, rgba(15,23,42,0.6))`,
        boxShadow: `0 0 12px ${accent}66`,
      }}
    >
      <div className="font-semibold">{template.name}</div>
      {template.description && <div className="text-textSecondary">{template.description}</div>}
    </button>
  );
}
