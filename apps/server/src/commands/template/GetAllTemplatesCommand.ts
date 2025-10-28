import type { ITemplateRepository } from '../../repositories/TemplateRepository';
import type { BusinessCardTemplate } from '../../models/BusinessCardTemplate';

export class GetAllTemplatesCommand {
  constructor(private readonly repo: ITemplateRepository) {}

  execute(): BusinessCardTemplate[] {
    return this.repo.getAll();
  }
}