"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoutes = cardRoutes;
const env_1 = require("../config/env");
const OpenAiRepository_1 = require("../repositories/OpenAiRepository");
const GenerateCardCommand_1 = require("../commands/card/GenerateCardCommand");
async function cardRoutes(app) {
    // New endpoint: POST /card per spec
    app.post('/card', {
        schema: {
            body: {
                type: 'object',
                required: ['description'],
                properties: {
                    description: { type: 'string', minLength: 1, maxLength: 1000 },
                },
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        card: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                subtitle: { type: 'string' },
                                fields: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: { label: { type: 'string' }, value: { type: 'string' } },
                                    },
                                },
                                notes: { type: 'string' },
                            },
                        },
                        templates: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                400: { type: 'object', properties: { error: { type: 'string' } } },
                500: { type: 'object', properties: { error: { type: 'string' } } },
            },
            description: 'Generate a business card from natural language',
            tags: ['card'],
        },
    }, async (req, reply) => {
        const body = req.body;
        if (!body?.description || typeof body.description !== 'string') {
            return reply.code(400).send({ error: 'description must be a non-empty string' });
        }
        try {
            const cfg = (0, env_1.loadConfig)();
            const repo = app.makeOpenAiRepository
                ? app.makeOpenAiRepository()
                : new OpenAiRepository_1.OpenAiRepository({
                    baseUrl: cfg.openai.baseUrl,
                    apiKeys: cfg.openai.apiKeys,
                    organization: cfg.openai.organization,
                    model: cfg.openai.model,
                    timeoutMs: cfg.openai.timeoutMs,
                });
            const cmd = new GenerateCardCommand_1.GenerateCardCommand(repo);
            const result = await cmd.execute({ description: body.description });
            return { card: result.info, templates: result.relevantTemplates };
        }
        catch (err) {
            app.log.error({ err }, 'Failed to generate business card');
            const msg = typeof err?.message === 'string' ? err.message : 'Internal error';
            const status = msg.includes('required') || msg.includes('must be') ? 400 : 500;
            return reply.code(status).send({ error: msg });
        }
    });
}
