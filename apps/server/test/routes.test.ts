import { strict as assert } from 'assert';
import Fastify from 'fastify';
import { userRoutes } from '../src/routes/users';
import { cardRoutes } from '../src/routes/card';

describe('Routes', () => {
  const app = Fastify();
  before(async () => {
    app.register(userRoutes, { prefix: '/api' });
    app.register(cardRoutes, { prefix: '/api' });
    await app.ready();
  });
  after(async () => {
    await app.close();
  });

  it('GET /api/users lists users', async () => {
    const res = await app.inject({ method: 'GET', url: '/api/users' });
    assert.equal(res.statusCode, 200);
  });

  it('POST /api/card/generate requires params', async () => {
    const res = await app.inject({ method: 'POST', url: '/api/card/generate', payload: {} });
    assert.equal(res.statusCode, 400);
  });
});
