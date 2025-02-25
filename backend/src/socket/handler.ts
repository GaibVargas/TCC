import { CustomServer, CustomSocket, SessionIdentification } from './types'
import { delay } from '../utils/time'
import { SessionsManager } from '../entities/session/sessions-manager'

export async function instructorJoin(
  io: CustomServer,
  socket: CustomSocket,
  payload: SessionIdentification,
): Promise<void> {
  await delay()
  const sessions_manager = SessionsManager.getInstance()
  sessions_manager.instructorEnterSession(payload.session_code, socket)
  console.log(socket.data.user.public_id, 'enter in', payload.session_code)
}
