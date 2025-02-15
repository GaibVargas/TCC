import { Server, Socket } from 'socket.io'
import { MinUser } from '../entities/user/type'
import { EventsMap } from 'socket.io/dist/typed-events'

export interface ServerToClientEvents {
  message: (payload: { text: string; timestamp: number }) => void
  'new-participant': (payload: void) => void
}

export interface SessionIdentification {
  session_code: string
  user_public_id: string
}

export interface ClientToServerEvents {
  'instructor:join': (payload: SessionIdentification) => Promise<void>
}

export interface SocketData {
  user: MinUser
}

export type CustomServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  EventsMap,
  SocketData
>
export type CustomSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  EventsMap,
  SocketData
>
