import type { FastifyInstance } from 'fastify';
import { JsonTemplateRepository } from '../repositories/TemplateRepository';
import { GetAllTemplatesCommand } from '../commands/template/GetAllTemplatesCommand';

export async function templateRoutes(app: FastifyInstance) {
  const repo = new JsonTemplateRepository();
  const getAllTemplates = new GetAllTemplatesCommand(repo);

  app.get('/templates', async () => ({ templates: getAllTemplates.execute() }));
}