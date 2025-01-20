import Fastify from 'fastify'
import { config } from './config/env'
import ltiRoutes from './lti/routes'

const server = Fastify({
  logger: true
})

server.get('/healthcheck', async (_request, _reply) => {
  return { message: 'Hello World!' }
})

server.register(ltiRoutes, { prefix: '/lti'  })

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
