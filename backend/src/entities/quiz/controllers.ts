import { FastifyReply, FastifyRequest } from "fastify"
import quizServices from "./services"
import { create_quiz_schema } from "./type"
import { userVerify } from "../../auth/services"

export async function createQuiz(req: FastifyRequest, _reply: FastifyReply): Promise<void> {
  userVerify(req.user)
  return await quizServices.createQuiz(req.user, create_quiz_schema.parse(req.body))
}

const quizController = {
  createQuiz,
}

export default quizController