"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = userRoutes;
const UserRepository_1 = require("../repositories/UserRepository");
const GetUserCommand_1 = require("../commands/GetUserCommand");
async function userRoutes(app) {
    const repo = new UserRepository_1.InMemoryUserRepository();
    const getUser = new GetUserCommand_1.GetUserCommand(repo);
    app.get('/users/:id', async (req, reply) => {
        const { id } = req.params;
        const user = getUser.execute(id);
        if (!user)
            return reply.code(404).send({ error: 'User not found' });
        return { user };
    });
    app.get('/users', async () => ({ users: repo.list() }));
}
