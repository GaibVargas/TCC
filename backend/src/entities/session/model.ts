import { Session } from '@prisma/client'
import prisma from '../../config/db'
import { SessionStatus } from './type'

export async function createSession(
  code: string,
  status: SessionStatus,
  quiz_id: number,
  current_question_public_id: string,
): Promise<number> {
  const session = await prisma.session.create({
    data: {
      code,
      status,
      quiz_id,
      current_question_public_id,
    },
  })
  return session.id
}

export async function updateStatusById(
  id: number,
  status: SessionStatus,
): Promise<void> {
  await prisma.session.update({
    where: { id },
    data: {
      status,
    },
  })
}

export async function updateStatusAndCurrentQuestionById(
  id: number,
  status: SessionStatus,
  current_question_public_id: string,
): Promise<void> {
  await prisma.session.update({
    where: { id },
    data: {
      status,
      current_question_public_id,
    },
  })
}

export type SessionUpdateData = Partial<
  Pick<Session, 'status' | 'current_question_public_id'>
>
export async function updateSessionById(
  id: number,
  data: SessionUpdateData,
): Promise<void> {
  await prisma.session.update({
    where: { id },
    data,
  })
}

export type SessionQuestionAnswerData = {
  value: string
  player_id: number
  session_id: number
  question_id: number
}
export async function saveSessionQuestionAnswersById(
  answers: SessionQuestionAnswerData[],
): Promise<void> {
  await prisma.answer.createMany({
    data: answers,
  })
}

export type Player = {
  lms_iss: string
  lms_platform: string
  lms_user_id: string
  lms_version: string
  lms_client_id: string
  lms_outcome_source_id: string
  lms_outcome_service_url: string
  user_id: number
  session_id: number
}
export async function upsertPlayer(player: Player): Promise<void> {
  await prisma.player.upsert({
    where: {
      user_id_session_id: {
        user_id: player.user_id,
        session_id: player.session_id,
      },
    },
    create: {
      ...player,
    },
    update: {
      lms_iss: player.lms_iss,
      lms_platform: player.lms_platform,
      lms_user_id: player.lms_user_id,
      lms_version: player.lms_version,
      lms_client_id: player.lms_client_id,
      lms_outcome_source_id: player.lms_outcome_source_id,
      lms_outcome_service_url: player.lms_outcome_service_url,
    },
  })
}

const sessionModel = {
  createSession,
  updateSessionById,
  saveSessionQuestionAnswersById,
  upsertPlayer,
}

export default sessionModel
