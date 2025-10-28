"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const users_1 = require("./routes/users");
const card_1 = require("./routes/card");
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
app.register(async (instance) => {
    instance.register(users_1.userRoutes, { prefix: '/api' });
    instance.register(card_1.cardRoutes, { prefix: '/api' });
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
