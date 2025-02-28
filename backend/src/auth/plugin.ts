import { FastifyPluginCallback } from 'fastify'
import { verifyToken } from './token'
import { config } from '../config/env'
import { minUserSchema, UserRoles } from '../entities/user/type'
import fastifyPlugin from 'fastify-plugin'

const authenticationPluginCb: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('onRequest', async (req, reply) => {
    if (req.routeOptions.config.skipAuth) {
      return
    }

    const access_token = req.headers.authorization
    if (!access_token) {
      return reply
        .status(400)
        .send({ message: 'Authorization token is required' })
    }
    const token = verifyToken(access_token, config.auth.ACCESS_TOKEN_SECRET)
    if (!token.valid) {
      return reply.status(401).send({ message: token.error })
    }
    return req.user = minUserSchema.parse(token.decoded)
  })
  done()
}
export const authenticationPlugin = fastifyPlugin(authenticationPluginCb)

const isInstructorPluginCb: FastifyPluginCallback = (fastify, _opts, done) => {
  fastify.addHook('onRequest', async (req, reply) => {
    if (req.routeOptions.config.skipAuth || req.routeOptions.config.skipRole) {
      return
    }
    if (!req.user) {
      return reply
        .status(401)
        .send({ message: 'Unauthorized' })
    }

    if (req.user.role !== UserRoles.INSTRUCTOR)
      return reply
        .status(401)
        .send({ message: 'Unauthorized' })
  })
  done()
}
export const isInstructorPlugin = fastifyPlugin(isInstructorPluginCb) 
