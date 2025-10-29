"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const OpenAiRepository_1 = require("../src/repositories/OpenAiRepository");
function makeMockClient(content, delayMs = 0) {
    const client = {
        chat: {
            completions: {
                create: (_req, _opts) => new Promise((resolve) => {
                    setTimeout(() => {
                        resolve({ choices: [{ message: { content } }] });
                    }, delayMs);
                }),
            },
        },
    };
    return client;
}
describe('OpenAiRepository', () => {
    it('parses valid JSON content', async () => {
        const client = makeMockClient('{"title":"t","fields":[{"label":"a","value":"b"}],"notes":"n"}');
        const mockTemplates = [
            { id: '1', name: 'Modern', description: 'Modern style', tags: ['modern'], isPremium: false, imagePreview: '', frontTemplate: '', backTemplate: '', dataTemplates: [], createdDate: '', updatedDate: '' },
            { id: '2', name: 'Classic', description: 'Classic style', tags: ['classic'], isPremium: false, imagePreview: '', frontTemplate: '', backTemplate: '', dataTemplates: [], createdDate: '', updatedDate: '' },
        ];
        const templateRepo = { getAll: () => mockTemplates };
        const repo = new OpenAiRepository_1.OpenAiRepository({ baseUrl: 'https://api.openai.com', apiKeys: ['k'], model: 'm', timeoutMs: 5000, client, templateRepo });
        const res = await repo.analyzeRequest('modern desc', 'web');
        assert_1.strict.equal(res.info.title, 't');
        assert_1.strict.equal(res.info.notes, 'n');
        assert_1.strict.equal(res.info.fields[0].label, 'a');
        assert_1.strict.equal(res.info.fields[0].value, 'b');
        assert_1.strict.ok(Array.isArray(res.relevantTemplates));
        assert_1.strict.ok(res.relevantTemplates.length <= 3);
    });
    it('falls back on invalid JSON', async () => {
        const client = makeMockClient('not json');
        const templateRepo = { getAll: () => [] };
        const repo = new OpenAiRepository_1.OpenAiRepository({ baseUrl: 'https://api.openai.com', apiKeys: ['k'], model: 'm', timeoutMs: 5000, client, templateRepo });
        const res = await repo.analyzeRequest('desc', 'web');
        assert_1.strict.equal(res.info.title, 'Business Card');
        assert_1.strict.equal(res.info.fields[0].label, 'Info');
        assert_1.strict.equal(res.info.fields[0].value, 'desc');
    });
    it('times out and throws', async () => {
        const client = {
            chat: { completions: { create: () => new Promise(() => { }) } },
        };
        const templateRepo = { getAll: () => [] };
        const repo = new OpenAiRepository_1.OpenAiRepository({ baseUrl: 'https://api.openai.com', apiKeys: ['k'], model: 'm', timeoutMs: 10, client, templateRepo });
        await assert_1.strict.rejects(() => repo.analyzeRequest('desc', 'web'), /timed out/i);
    });
    it('finds 3 most relevant templates', async () => {
        const client = makeMockClient('{"title":"t","fields":[{"label":"a","value":"b"}]}');
        const mockTemplates = [
            { id: 'a', name: 'Modern Tech', description: 'Blue modern layout', tags: ['modern', 'tech', 'blue'], isPremium: false, imagePreview: '', frontTemplate: '', backTemplate: '', dataTemplates: [], createdDate: '', updatedDate: '' },
            { id: 'b', name: 'Classic Black', description: 'Traditional style', tags: ['classic', 'black'], isPremium: false, imagePreview: '', frontTemplate: '', backTemplate: '', dataTemplates: [], createdDate: '', updatedDate: '' },
            { id: 'c', name: 'Eco Green', description: 'Green nature', tags: ['green', 'eco'], isPremium: false, imagePreview: '', frontTemplate: '', backTemplate: '', dataTemplates: [], createdDate: '', updatedDate: '' },
            { id: 'd', name: 'Professional Blue', description: 'Blue corporate', tags: ['professional', 'blue'], isPremium: false, imagePreview: '', frontTemplate: '', backTemplate: '', dataTemplates: [], createdDate: '', updatedDate: '' },
        ];
        const templateRepo = { getAll: () => mockTemplates };
        const repo = new OpenAiRepository_1.OpenAiRepository({ baseUrl: 'https://api.openai.com', apiKeys: ['k'], model: 'm', timeoutMs: 5000, client, templateRepo });
        const res = await repo.analyzeRequest('Looking for modern tech professional blue logo', 'web');
        assert_1.strict.equal(res.relevantTemplates.length, 3);
        const ids = res.relevantTemplates.map((t) => t.id);
        assert_1.strict.ok(ids.includes('a'));
        assert_1.strict.ok(ids.includes('d'));
    });
});
