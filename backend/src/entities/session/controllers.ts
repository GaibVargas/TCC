import { FastifyReply, FastifyRequest } from 'fastify'
import { userVerify } from '../../auth/services'
import quizServices from '../quiz/services'
import { SessionsManager } from './sessions-manager'
import {
  create_session_payload_schema,
  InstructorSessionState,
  ParticipantSessionState,
  SessionCreatePayload,
} from './type'
import HttpRequestError from '../../utils/error'

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

export function getSessionState(
  req: FastifyRequest<{ Params: { code: string } }>,
  _reply: FastifyReply,
): InstructorSessionState | ParticipantSessionState {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  console.log('AAAAAAAAAAAAAAAAAAAAA', session.instructor.public_id, req.user.public_id)
  if (session.instructor.public_id === req.user.public_id)
    return session.getInstructorState()
  if (session.getParticipantsId().includes(req.user.public_id))
    return session.getParticipantState()
  throw new HttpRequestError({
    status_code: 400,
    message: 'Session not found'
  })
}

const sessionControllers = {
  createSession,
  getSessionState,
}

export default sessionControllers
