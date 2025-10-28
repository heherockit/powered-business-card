"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cardRoutes = cardRoutes;
const OpenAIService_1 = require("../services/OpenAIService");
async function cardRoutes(app) {
    app.post('/card/generate', async (req, reply) => {
        const body = req.body;
        if (!body?.description || !body?.version) {
            return reply.code(400).send({ error: 'description and version are required' });
        }
        try {
            const service = new OpenAIService_1.OpenAIService();
            const result = await service.generateCard({
                description: String(body.description),
                version: body.version === 'mobile' ? 'mobile' : 'web',
            });
            return { card: result };
        }
        catch (err) {
            app.log.error(err);
            return reply.code(500).send({ error: 'Failed to generate business card' });
        }
    });
}
