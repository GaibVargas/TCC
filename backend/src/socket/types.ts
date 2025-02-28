import { Server, Socket } from 'socket.io'
import { MinUser } from '../entities/user/type'
import { EventsMap } from 'socket.io/dist/typed-events'
import { InstructorSessionState, ParticipantSessionState, QuestionAnswer, SessionIdentification, SessionParticipants, SessionParticipantsQuestionAnswered } from '../entities/session/type'

export interface ClientToServerEvents {
  'instructor:join': (payload: SessionIdentification) => Promise<void>
  'instructor:leave': (payload: SessionIdentification) => Promise<void>

  'participant:join': (payload: SessionIdentification) => Promise<void>
  'participant:leave': (payload: SessionIdentification) => Promise<void>

  'game:start': (payload: SessionIdentification) => Promise<void>
  'game:next-step': (payload: SessionIdentification) => Promise<void>
  'game:question-answer': (payload: QuestionAnswer) => Promise<void>
}

export interface ServerToClientEvents {
  'game:instructor:participant-join': (
    payload: SessionParticipants,
  ) => Promise<void>
  'game:instructor:participant-leave': (
    payload: SessionParticipants,
  ) => Promise<void>
  'game:instructor:update-state': (
    payload: InstructorSessionState,
  ) => Promise<void>
  'game:instructor:question-answer': (
    payload: SessionParticipantsQuestionAnswered,
  ) => Promise<void>
  'game:participant:update-state': (
    payload: ParticipantSessionState,
  ) => Promise<void>
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
