import { FastifyInstance } from 'fastify'
import { authenticationPlugin, isInstructorPlugin } from '../../auth/plugin'
import sessionControllers from './controllers'

export default function sessionRoutes(
  fastify: FastifyInstance,
  _options: unknown,
): void {
  fastify.register(authenticationPlugin)
  fastify.get('/sync/:code', sessionControllers.getSessionState)
  fastify.post('/answer', sessionControllers.answerSessionQuestion)

  fastify.register(instructorSessionRoutes)
}

function instructorSessionRoutes(fastify: FastifyInstance, _options: unknown): void {
  fastify.register(isInstructorPlugin)
  fastify.post('/', sessionControllers.createSession)
  fastify.post('/start/:code', sessionControllers.startSession)
  fastify.post('/next-step/:code', sessionControllers.sessionNextStep)
}
