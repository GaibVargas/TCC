import { MinUser } from '../src/entities/user/type'

declare module 'fastify' {
  interface FastifyRequest {
    user?: MinUser
  }

  interface FastifyContextConfig {
    skipAuth?: boolean
  }
}
