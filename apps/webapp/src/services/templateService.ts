import { templates } from '../features/templates/data/templates';
import type { TemplateMeta } from '../features/templates/types';

export async function fetchTemplates(): Promise<TemplateMeta[]> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 200));
  return templates;
}