"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_1 = __importDefault(require("@fastify/swagger"));
const swagger_ui_1 = __importDefault(require("@fastify/swagger-ui"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const env_1 = require("./config/env");
const users_1 = require("./routes/users");
const card_1 = require("./routes/card");
const templates_1 = require("./routes/templates");
dotenv_1.default.config();
const app = (0, fastify_1.default)({ logger: true });
// Request/response logging hooks
app.addHook('onRequest', async (req) => {
    req.log.info({ method: req.method, url: req.url, id: req.id }, 'incoming request');
});
app.addHook('onResponse', async (req, reply) => {
    req.log.info({ statusCode: reply.statusCode }, 'response sent');
});
const cfg = (0, env_1.loadConfig)();
// Rate limiting (global default, can be overridden per route)
app.register(rate_limit_1.default, {
    max: cfg.rateLimit.max,
    timeWindow: cfg.rateLimit.timeWindowMs,
});
// Swagger/OpenAPI
app.register(swagger_1.default, {
    openapi: {
        info: {
            title: 'Powered Business Card API',
            description: 'API for generating business cards and templates',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:' + cfg.port }],
        tags: [
            { name: 'card', description: 'Card generation' },
            { name: 'templates', description: 'Templates catalog' },
            { name: 'users', description: 'Users' },
        ],
    },
});
app.register(swagger_ui_1.default, { routePrefix: '/docs', uiConfig: { docExpansion: 'list' } });
app.register(async (instance) => {
    instance.register(users_1.userRoutes, { prefix: '/api' });
    instance.register(card_1.cardRoutes, { prefix: '/api' });
    instance.register(templates_1.templateRoutes, { prefix: '/api' });
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
