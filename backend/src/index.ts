import Fastify from 'fastify'

const server = Fastify()

server.get('/', async (_request, _reply) => {
  return { message: 'Hello! Fastify with TypeScript!' }
})

const start = async (): Promise<void> => {
  try {
    await server.listen({ port: 3000 })
    console.log('Server listening on http://localhost:3000 ')
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
  .then()
  .catch((error) => console.error(error))
