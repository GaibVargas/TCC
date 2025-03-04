import { FastifyInstance } from 'fastify'
import { authenticationPlugin, isInstructorPlugin } from '../../auth/plugin'
import sessionControllers from './controllers'

export default function sessionRoutes(
  fastify: FastifyInstance,
  _options: unknown,
): void {
  fastify.register(authenticationPlugin)
  fastify.register(instructorSessionRoutes)
  fastify.get('/sync/:code', sessionControllers.getSessionState)
}

function instructorSessionRoutes(fastify: FastifyInstance, _options: unknown): void {
  fastify.register(isInstructorPlugin)
  fastify.post('/', sessionControllers.createSession)
}
