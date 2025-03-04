import { CustomServer, CustomSocket } from './types'
import * as handler from './handlers'

export function registerSocketHandlers(io: CustomServer, socket: CustomSocket): void {
  socket.on('instructor:join', payload => handler.instructorJoin(io, socket, payload))
  socket.on('participant:join', payload => handler.participantJoin(io, socket, payload))
}

