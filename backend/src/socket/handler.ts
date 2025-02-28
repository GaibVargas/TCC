import { CustomServer, CustomSocket } from './types'
import { delay } from '../utils/time'
import { SessionsManager } from '../entities/session/sessions-manager'
import { SessionIdentification } from '../entities/session/type'

export async function instructorJoin(
  io: CustomServer,
  socket: CustomSocket,
  payload: SessionIdentification,
): Promise<void> {
  await delay(1)
  const sessions_manager = SessionsManager.getInstance()
  sessions_manager.instructorEnterSession(payload.code, socket)
  console.log(socket.data.user.public_id, '[i] enter in', payload.code)
}

export async function instructorLeave(
  io: CustomServer,
  socket: CustomSocket,
  payload: SessionIdentification,
): Promise<void> {
  await delay(1)
  const sessions_manager = SessionsManager.getInstance()
  sessions_manager.instructorLeaveSession(payload.code)
  console.log(socket.data.user.public_id, '[i] leave in', payload.code)
}

export async function participantJoin(
  io: CustomServer,
  socket: CustomSocket,
  payload: SessionIdentification,
): Promise<void> {
  await delay(1)
  const sessions_manager = SessionsManager.getInstance()
  sessions_manager.participantEnterSession(payload.code, socket.data.user, socket)
  console.log(socket.data.user.public_id, '[p] enter in', payload.code)
}

export async function participantLeave(
  io: CustomServer,
  socket: CustomSocket,
  payload: SessionIdentification,
): Promise<void> {
  await delay(1)
  const sessions_manager = SessionsManager.getInstance()
  sessions_manager.participantLeaveSession(payload.code, socket.data.user)
  console.log(socket.data.user.public_id, '[p] leave in', payload.code)
}

export async function gameStart(
  io: CustomServer,
  socket: CustomSocket,
  payload: SessionIdentification,
): Promise<void> {
  await delay(1)
  const sessions_manager = SessionsManager.getInstance()
  sessions_manager.startSession(payload.code)
}
