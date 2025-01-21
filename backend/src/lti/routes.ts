import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { MoodleLTIServices, startPayloadSchema } from './moodle/services'

const moodleLTIServices = new MoodleLTIServices()

export default function ltiRoutes(fastify: FastifyInstance, _options: unknown): void {
  fastify.post('/login', async (req: FastifyRequest, _reply: FastifyReply) => {
    const redirect_url = await moodleLTIServices.startLaunch(startPayloadSchema.parse(req.body))
    return redirect_url
  })
}
