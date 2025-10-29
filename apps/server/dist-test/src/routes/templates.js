"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateRoutes = templateRoutes;
const TemplateRepository_1 = require("../repositories/TemplateRepository");
const GetAllTemplatesCommand_1 = require("../commands/template/GetAllTemplatesCommand");
async function templateRoutes(app) {
    const repo = new TemplateRepository_1.JsonTemplateRepository();
    const getAllTemplates = new GetAllTemplatesCommand_1.GetAllTemplatesCommand(repo);
    app.get('/templates', async () => ({ templates: getAllTemplates.execute() }));
}
