import { CustomServer, CustomSocket } from './types'
import * as handler from './handler'

export function registerSocketHandlers(io: CustomServer, socket: CustomSocket): void {
  socket.on('instructor:join', payload => handler.instructorJoin(io, socket, payload))
}

