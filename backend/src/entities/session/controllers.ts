import { FastifyReply, FastifyRequest } from 'fastify'
import { userVerify } from '../../auth/services'
import quizServices from '../quiz/services'
import { SessionsManager } from './sessions-manager'
import {
  answer_session_question_schema,
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

export function startSession(
  req: FastifyRequest<{ Params: { code: string } }>,
  _reply: FastifyReply,
): void {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (session.isValidInstructor(req.user.public_id)) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized',
    })
  }
  sessions_manager.startSession(req.params.code)
}

export function sessionNextStep(
  req: FastifyRequest<{ Params: { code: string } }>,
  _reply: FastifyReply,
): void {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (session.isValidInstructor(req.user.public_id)) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized',
    })
  }
  sessions_manager.sessionNextStep(req.params.code)
}

export function getSessionState(
  req: FastifyRequest<{ Params: { code: string } }>,
  _reply: FastifyReply,
): InstructorSessionState | ParticipantSessionState {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (session.isValidInstructor(req.user.public_id))
    return session.getInstructorState()
  if (session.isValidParticipant(req.user.public_id))
    return session.getParticipantState(req.user.public_id)
  throw new HttpRequestError({
    status_code: 400,
    message: 'Session not found',
  })
}

export function answerSessionQuestion(
  req: FastifyRequest<{ Params: { code: string } }>,
  _reply: FastifyReply,
): void {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (!session.isValidParticipant(req.user.public_id)) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized',
    })
  }
  const body = answer_session_question_schema.parse(req.body)
  session.answerQuestion(
    req.user.public_id,
    body.question_public_id,
    body.answer,
  )
}

const sessionControllers = {
  createSession,
  getSessionState,
  startSession,
  sessionNextStep,
  answerSessionQuestion,
}

export default sessionControllers
