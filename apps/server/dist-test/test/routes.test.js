"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const fastify_1 = __importDefault(require("fastify"));
const users_1 = require("../src/routes/users");
const card_1 = require("../src/routes/card");
describe('Routes', () => {
    const app = (0, fastify_1.default)();
    before(async () => {
        app.register(users_1.userRoutes, { prefix: '/api' });
        app.register(card_1.cardRoutes, { prefix: '/api' });
        await app.ready();
    });
    after(async () => {
        await app.close();
    });
    it('GET /api/users lists users', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/users' });
        assert_1.strict.equal(res.statusCode, 200);
    });
    it('POST /api/card/generate requires params', async () => {
        const res = await app.inject({ method: 'POST', url: '/api/card/generate', payload: {} });
        assert_1.strict.equal(res.statusCode, 400);
    });
});
