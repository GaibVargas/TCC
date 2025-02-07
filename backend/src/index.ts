import Fastify from 'fastify'
import { z } from 'zod'
import fastifyFormbody from '@fastify/formbody'
import cors from '@fastify/cors'
import { Prisma } from '@prisma/client'
import { config } from './config/env'
import ltiRoutes from './lti/routes'
import prisma from './config/db'
import userRoutes from './entities/user/routes'
import HttpRequestError from './utils/error'
import authRoutes from './auth/routes'
import quizRoutes from './entities/quiz/routes'

const server = Fastify({
  logger: true,
})

server.register(fastifyFormbody)
server.register(cors, {
  origin: 'http://localhost:3000'
})

const prismaErrors = [
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientRustPanicError,
]
server.setErrorHandler((error, _request, reply) => {
  server.log.error(error)

  if (error instanceof HttpRequestError) {
    return reply.status(error.status_code).send({
      status_code: error.status_code,
      error: 'Request error',
      message: error.message,
    })
  }

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const validationErrors = error.errors.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
    }))

    return reply.status(400).send({
      status_code: 400,
      error: 'Bad Request',
      message: 'Validation Error',
      issues: validationErrors,
    })
  }

  // Handle Prisma errors
  if (prismaErrors.some((errorType) => error instanceof errorType)) {
    let status_code = 500
    let message = 'Database error'

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      message = `Request error code ${error.code}`
    } else if (error instanceof Prisma.PrismaClientValidationError) {
      status_code = 400
      message = `Validation error code ${error.code}`
    } else if (error instanceof Prisma.PrismaClientRustPanicError) {
      message = 'Database Engine Unavailable'
    }

    return reply.status(status_code).send({
      status_code,
      error: 'Database Request Error',
      message,
    })
  }

  return reply.status(500).send({
    status_code: 500,
    error: 'UnknownError',
    message: 'An unknown error occurred',
  })
})

server.get('/healthcheck', async (_request, _reply) => {
  return { message: 'Hello World!' }
})
server.register(ltiRoutes, { prefix: '/lti' })
server.register(authRoutes, { prefix: '/auth' })
server.register(userRoutes, { prefix: '/user' })
server.register(quizRoutes, { prefix: '/quiz' })

const start = async (): Promise<void> => {
  try {
    await prisma.$connect()
    await server.listen({ port: config.host.PORT })
  } catch (err) {
    server.log.error(err)
    await prisma.$disconnect()
    process.exit(1)
  }
}

start()
  .then()
  .catch((error) => console.error(error))
