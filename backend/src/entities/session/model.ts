import prisma from '../../config/db'
import { SessionStatus } from './type'

export async function createSession(
  code: string,
  status: SessionStatus,
  quiz_id: number,
): Promise<number> {
  const session = await prisma.session.create({
    data: {
      code,
      status,
      quiz_id,
    },
  })
  return session.id
}

const sessionModel = {
  createSession,
}

export default sessionModel
