import { FastifyPluginCallback } from 'fastify'
import { verifyToken } from './token'
import { config } from '../config/env'
import { MinUser } from '../entities/user/type'
import fastifyPlugin from 'fastify-plugin'

const authenticationPlugin: FastifyPluginCallback = (fastify, _opts, done) => {
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
    return (req.user = token.decoded as MinUser)
  })
  done()
}

export default fastifyPlugin(authenticationPlugin)
