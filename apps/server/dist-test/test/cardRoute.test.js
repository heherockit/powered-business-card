"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fastify_1 = __importDefault(require("fastify"));
const card_1 = require("../src/routes/card");
describe('POST /api/card', () => {
    it('returns 200 with card when description is valid', async () => {
        process.env.OPENAI_API_KEY = 'dummy';
        const app = (0, fastify_1.default)();
        app.decorate('makeOpenAiRepository', () => ({
            analyzeRequest: async (text) => ({ info: { title: 'ok', fields: [{ label: 'd', value: text }] }, relevantTemplates: [{ id: 'x', name: 'Mock' }] }),
        }));
        await app.register(card_1.cardRoutes, { prefix: '/api' });
        const res = await app.inject({ method: 'POST', url: '/api/card', payload: { description: 'hello' } });
        assert_1.strict.equal(res.statusCode, 200);
        const body = JSON.parse(res.body);
        assert_1.strict.equal(body.card.title, 'ok');
        assert_1.strict.ok(Array.isArray(body.templates));
    });
    it('returns 400 on invalid payload', async () => {
        process.env.OPENAI_API_KEY = 'dummy';
        const app = (0, fastify_1.default)();
        await app.register(card_1.cardRoutes, { prefix: '/api' });
        const res = await app.inject({ method: 'POST', url: '/api/card', payload: { description: '' } });
        assert_1.strict.equal(res.statusCode, 400);
        const body = JSON.parse(res.body);
        assert_1.strict.ok(body.error);
    });
});
