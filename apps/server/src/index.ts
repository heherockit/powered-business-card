import Fastify from 'fastify';
import dotenv from 'dotenv';
// Swagger temporarily disabled due to Fastify version mismatch
import { loadConfig } from './config/env';
import { userRoutes } from './routes/users';
import { cardRoutes } from './routes/card';
import { templateRoutes } from './routes/templates';

dotenv.config();

const app = Fastify({ logger: true });

// Request/response logging hooks
app.addHook('onRequest', async (req) => {
  req.log.info({ method: req.method, url: req.url, id: req.id }, 'incoming request');
});
app.addHook('onResponse', async (req, reply) => {
  req.log.info({ statusCode: reply.statusCode }, 'response sent');
});

const cfg = loadConfig();

// Rate limiting removed due to Fastify version mismatch. If needed later,
// re-enable with a compatible Fastify version or guard behind feature flag.

// Swagger/OpenAPI disabled; re-enable with compatible versions as needed

// Minimal CORS support for dev without plugin (Fastify v4)
app.addHook('onSend', async (req, reply, payload) => {
  const origin = (req.headers.origin as string) || '*';
  reply.header('Access-Control-Allow-Origin', origin);
  reply.header('Vary', 'Origin');
  reply.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  reply.header('Access-Control-Allow-Headers',
    (req.headers['access-control-request-headers'] as string) || 'Content-Type, Accept'
  );
  return payload;
});

app.options('/*', async (req, reply) => {
  const origin = (req.headers.origin as string) || '*';
  reply.header('Access-Control-Allow-Origin', origin);
  reply.header('Vary', 'Origin');
  reply.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  reply.header('Access-Control-Allow-Headers',
    (req.headers['access-control-request-headers'] as string) || 'Content-Type, Accept'
  );
  reply.code(204).send();
});

app.register(async (instance) => {
  instance.register(userRoutes, { prefix: '/api' });
  instance.register(cardRoutes, { prefix: '/api' });
  instance.register(templateRoutes, { prefix: '/api' });
});

const port = cfg.port;

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`Server listening on http://localhost:${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
