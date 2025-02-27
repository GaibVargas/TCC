import { FastifyReply, FastifyRequest } from 'fastify'
import { userVerify } from '../../auth/services'
import quizServices from '../quiz/services'
import { SessionsManager } from './sessions-manager'
import { create_session_payload_schema, SessionCreatePayload } from './type'

export async function createSession(
  req: FastifyRequest,
  _reply: FastifyReply,
): Promise<SessionCreatePayload> {
  userVerify(req.user)
  const session = create_session_payload_schema.parse(req.body)
  const quiz = await quizServices.getQuiz(session.quiz_public_id)
  const sessions_manager = SessionsManager.getInstance()
  return {
    quiz: {
      public_id: quiz.public_id,
      title: quiz.title,
    },
    code: sessions_manager.newSession(req.user, quiz),
  }
}

const sessionControllers = {
  createSession,
}

export default sessionControllers
