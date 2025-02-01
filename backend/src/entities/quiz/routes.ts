import { FastifyInstance } from 'fastify'
import { authenticationPlugin, isInstructorPlugin } from '../../auth/plugin'
import quizController from './controllers'

export default function quizRoutes(
  fastify: FastifyInstance,
  _options: unknown,
): void {
  fastify.register(authenticationPlugin)
  fastify.register(isInstructorPlugin)

  fastify.post('/', quizController.createQuiz)
  fastify.get('/:public_id', quizController.getQuiz)
  fastify.post('/:public_id', quizController.updateQuiz)
}
