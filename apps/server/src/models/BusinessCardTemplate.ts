import type { DataTemplateConfig } from './DataTemplateConfig';

export interface BusinessCardTemplate {
  name: string;
  description: string;
  tags: string[];
  isPremium: boolean;
  imagePreview: string;
  frontTemplate: string;
  backTemplate: string;
  dataTemplates: DataTemplateConfig[];
  createdDate: string;
  updatedDate: string;
}
