import type { FastifyInstance } from 'fastify'
import { OpenAIService, type CardRequest } from '../services/OpenAIService'

export async function cardRoutes(app: FastifyInstance) {
  app.post('/card/generate', async (req, reply) => {
    const body = req.body as Partial<CardRequest>
    if (!body?.description || !body?.version) {
      return reply.code(400).send({ error: 'description and version are required' })
    }
    try {
      const service = new OpenAIService()
      const result = await service.generateCard({
        description: String(body.description),
        version: body.version === 'mobile' ? 'mobile' : 'web',
      })
      return { card: result }
    } catch (err) {
      app.log.error(err)
      return reply.code(500).send({ error: 'Failed to generate business card' })
    }
  })
}