import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MoodleLTIServices } from './moodle/services'

const moodleLTIServices = new MoodleLTIServices()

export default function ltiRoutes(fastify: FastifyInstance, _options: unknown): void {
  fastify.post('/login', async (_req: FastifyRequest, _reply: FastifyReply) => {
    const user = await moodleLTIServices.getUser()
    return user
  })
}
