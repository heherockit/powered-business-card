import { strict as assert } from 'assert';
import Fastify from 'fastify';
import { cardRoutes } from '../src/routes/card';

describe('POST /api/card', () => {
  it('returns 200 with card when description is valid', async () => {
    process.env.OPENAI_API_KEY = 'dummy';
    const app = Fastify();
    app.decorate('makeOpenAiRepository', () => ({
      analyzeRequest: async (text: string) => ({
        info: { title: 'ok', fields: [{ label: 'd', value: text }] },
        relevantTemplates: [{ id: 'x', name: 'Mock' }],
      }),
    }));
    await app.register(cardRoutes, { prefix: '/api' });
    const res = await app.inject({
      method: 'POST',
      url: '/api/card',
      payload: { description: 'hello' },
    });
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.card.title, 'ok');
    assert.ok(Array.isArray(body.templates));
  });

  it('returns 400 on invalid payload', async () => {
    process.env.OPENAI_API_KEY = 'dummy';
    const app = Fastify();
    await app.register(cardRoutes, { prefix: '/api' });
    const res = await app.inject({
      method: 'POST',
      url: '/api/card',
      payload: { description: '' },
    });
    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.body);
    assert.ok(body.error);
  });
});
