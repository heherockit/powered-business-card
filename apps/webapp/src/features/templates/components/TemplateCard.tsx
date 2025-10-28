import type { TemplateMeta } from '../types';

export function TemplateCard({
  template,
  onSelect,
}: {
  template: TemplateMeta;
  onSelect?: (t: TemplateMeta) => void;
}) {
  return (
    <div className="card overflow-hidden">
      <button
        type="button"
        onClick={() => onSelect?.(template)}
        className="group relative block w-full text-left"
        aria-label={`template-${template.name}`}
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img
            src={template.imagePreview}
            alt={template.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
          {/* Premium badge */}
          {template.isPremium && (
            <div className="absolute top-2 left-2 z-20 px-2 py-1 rounded-md bg-highlight text-white text-xs font-semibold shadow-soft">
              Premium
            </div>
          )}
          {/* Overlay */}
          <div className="absolute inset-0 z-0 bg-black/40 opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100" />
          {/* Description reveal from bottom covering ~1/2 image */}
          <div className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-black/70 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
            <div className="p-4 text-white text-sm">
              {template.description}
            </div>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="font-semibold text-textPrimary">{template.name}</div>
        </div>
      </button>
    </div>
  );
}
