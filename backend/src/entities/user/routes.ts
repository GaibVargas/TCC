import { FastifyInstance } from "fastify"
import authenticationPlugin from "../../auth/plugin"

export default function userRoutes(fastify: FastifyInstance, _options: unknown): void {
  fastify.register(authenticationPlugin)
  fastify.get('/protected', (_req, _res) => {
    return { msg: 'protected accessed' }
  })
  fastify.get('/public', { config: { skipAuth: true } }, (_req, _res) => {
    return { msg: 'public accessed' }
  })
}