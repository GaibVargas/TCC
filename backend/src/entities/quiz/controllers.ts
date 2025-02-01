import { FastifyReply, FastifyRequest } from 'fastify'
import quizServices from './services'
import { create_quiz_schema, Quiz, update_quiz_schema } from './type'
import { userVerify } from '../../auth/services'

export async function createQuiz(
  req: FastifyRequest,
  _reply: FastifyReply,
): Promise<Quiz> {
  userVerify(req.user)
  return await quizServices.createQuiz(
    req.user,
    create_quiz_schema.parse(req.body),
  )
}

interface PublicIdParams {
  public_id: string
}

export async function getQuiz(
  req: FastifyRequest<{ Params: PublicIdParams }>,
  _reply: FastifyReply,
): Promise<Quiz> {
  return await quizServices.getQuiz(req.params.public_id)
}

export async function updateQuiz(
  req: FastifyRequest<{ Params: PublicIdParams }>,
  _reply: FastifyReply,
): Promise<Quiz> {
  userVerify(req.user)
  await quizServices.userIsAuthorOfQuizOrThrow(req.user.public_id, req.params.public_id)
  return await quizServices.updateQuiz(req.params.public_id, update_quiz_schema.parse(req.body))
}

const quizController = {
  createQuiz,
  getQuiz,
  updateQuiz,
}

export default quizController
