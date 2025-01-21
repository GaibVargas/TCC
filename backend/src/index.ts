import Fastify from 'fastify'
import { z } from 'zod'
import fastifyFormbody from '@fastify/formbody'
import { config } from './config/env'
import ltiRoutes from './lti/routes'

const server = Fastify({
  logger: true,
})

server.register(fastifyFormbody)

server.setErrorHandler((error, request, reply) => {
  if (error instanceof z.ZodError) {
    const validationErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }))

    reply.status(400).send({
      statusCode: 400,
      error: 'Bad Request',
      message: 'Validation Error',
      issues: validationErrors,
    })
  } else {
    reply.status(error.statusCode || 500).send({
      statusCode: error.statusCode || 500,
      error: error.name,
      message: error.message,
    })
  }
})

server.get('/healthcheck', async (_request, _reply) => {
  return { message: 'Hello World!' }
})
server.register(ltiRoutes, { prefix: '/lti' })

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: config.host.PORT })
    console.log(
      `Server listening on http://localhost:${config.host.PORT} in ${config.host.NODE_ENV} mode`,
    )
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
  .then()
  .catch((error) => console.error(error))
