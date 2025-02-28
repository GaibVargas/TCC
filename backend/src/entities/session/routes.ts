import { FastifyInstance } from 'fastify'
import { authenticationPlugin, isInstructorPlugin } from '../../auth/plugin'
import sessionControllers from './controllers'

export default function sessionRoutes(
  fastify: FastifyInstance,
  _options: unknown,
): void {
  fastify.register(authenticationPlugin)
  fastify.register(isInstructorPlugin)

  fastify.post('/', sessionControllers.createSession)
  fastify.get('/sync/:code', { config: { skipRole: true } }, sessionControllers.getSessionState)
}
