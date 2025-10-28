import type { TemplateMeta } from '../features/templates/types';

interface ServerTemplate {
  name: string;
  description: string;
  imagePreview: string;
  isPremium: boolean;
}

type TemplatesResponse = { templates: ServerTemplate[] };

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export async function fetchTemplates(): Promise<TemplateMeta[]> {
  const endpoint = `${API_BASE}/api/templates`;
  try {
    const res = await fetch(endpoint, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as TemplatesResponse;
    if (!json?.templates || !Array.isArray(json.templates)) {
      throw new Error('Invalid response shape');
    }
    return json.templates.map((t) => ({
      name: t.name,
      description: t.description,
      imagePreview: t.imagePreview,
      isPremium: t.isPremium ?? false,
    }));
  } catch (err) {
    console.error('Failed to fetch templates', err);
    throw err;
  }
}
