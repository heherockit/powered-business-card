import type { FastifyInstance } from 'fastify';
import { InMemoryUserRepository } from '../repositories/UserRepository';
import { GetUserCommand } from '../commands/user/GetUserCommand';

export async function userRoutes(app: FastifyInstance) {
  const repo = new InMemoryUserRepository();
  const getUser = new GetUserCommand(repo);

  app.get('/users/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const user = getUser.execute(id);
    if (!user) return reply.code(404).send({ error: 'User not found' });
    return { user };
  });

  app.get('/users', async () => ({ users: repo.list() }));
}
