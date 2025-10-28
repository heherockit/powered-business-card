import Fastify from 'fastify';
import dotenv from 'dotenv';
import { userRoutes } from './routes/users';
import { cardRoutes } from './routes/card';
import { templateRoutes } from './routes/templates';

dotenv.config();

const app = Fastify({ logger: true });

app.register(async (instance) => {
  instance.register(userRoutes, { prefix: '/api' });
  instance.register(cardRoutes, { prefix: '/api' });
  instance.register(templateRoutes, { prefix: '/api' });
});

const port = Number(process.env.PORT || 8080);

app
  .listen({ port, host: '0.0.0.0' })
  .then(() => {
    app.log.info(`Server listening on http://localhost:${port}`);
  })
  .catch((err) => {
    app.log.error(err);
    process.exit(1);
  });
