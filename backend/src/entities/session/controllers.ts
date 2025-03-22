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
  SessionItem,
} from './type'
import HttpRequestError from '../../utils/error'
import { Paginated, pagination_query_schema, PaginationQuery } from '../../common/pagination'
import sessionServices from './services'

export async function createSession(
  req: FastifyRequest,
  _reply: FastifyReply,
): Promise<SessionCreatePayload> {
  userVerify(req.user)
  const session = create_session_payload_schema.parse(req.body)
  const [quiz, quiz_id] = await Promise.all([
    quizServices.getQuiz(session.quiz_public_id),
    quizServices.getQuizIdByPublicId(session.quiz_public_id),
  ])
  const sessions_manager = SessionsManager.getInstance()
  const code = await sessions_manager.newSession(req.user, quiz, quiz_id)
  return {
    quiz: {
      public_id: quiz.public_id,
      title: quiz.title,
    },
    code,
  }
}

export async function startSession(
  req: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply,
): Promise<void> {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (!session.isValidInstructor(req.user.public_id)) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized',
    })
  }
  await sessions_manager.startSession(req.params.code)
  reply.status(204).send()
}

export async function sessionNextStep(
  req: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply,
): Promise<void> {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (!session.isValidInstructor(req.user.public_id)) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized',
    })
  }
  await sessions_manager.sessionNextStep(req.params.code)
  reply.status(204).send()
}

export async function sessionEarlyEnd(
  req: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply,
): Promise<void> {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  if (!session.isValidInstructor(req.user.public_id)) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized',
    })
  }
  await sessions_manager.removeSession(req.params.code)
  reply.status(204).send()
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

export async function participantJoinSession(
  req: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply,
): Promise<void> {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  await session.addParticipant(req.user)
  reply.status(204).send()
}

export function participantLeaveSession(
  req: FastifyRequest<{ Params: { code: string } }>,
  reply: FastifyReply,
): void {
  userVerify(req.user)
  const sessions_manager = SessionsManager.getInstance()
  const session = sessions_manager.getSession(req.params.code)
  session.removeParticipant(req.user)
  reply.status(204).send()
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

export async function finishedSessionsByAuthor(
  req: FastifyRequest<{ Querystring: PaginationQuery }>,
  _reply: FastifyReply,
): Promise<Paginated<SessionItem[]>> {
  userVerify(req.user)
  return await sessionServices.getFinishedSessionsByAuthor(req.user, pagination_query_schema.parse(req.query))
}

export async function ongoingSessionsByAuthor(
  req: FastifyRequest,
  _reply: FastifyReply,
): Promise<SessionItem[]> {
  userVerify(req.user)
  return await sessionServices.getOngoingSessionsByAuthor(req.user)
}

const sessionControllers = {
  createSession,
  getSessionState,
  startSession,
  sessionNextStep,
  answerSessionQuestion,
  participantJoinSession,
  participantLeaveSession,
  finishedSessionsByAuthor,
  ongoingSessionsByAuthor,
  sessionEarlyEnd,
}

export default sessionControllers
