import Fastify from 'fastify'
import { config } from './config/env'

const server = Fastify()

server.get('/', async (_request, _reply) => {
  return { message: 'Hello! Fastify with TypeScript!' }
})

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: config.host.PORT })
    console.log(`Server listening on http://localhost:${config.host.PORT} in ${config.host.NODE_ENV} mode`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
  .then()
  .catch((error) => console.error(error))
