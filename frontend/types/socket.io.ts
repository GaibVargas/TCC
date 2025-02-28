import { Socket } from "socket.io-client"
import type { InstructorSessionState, ParticipantSessionState, QuestionAnswer, SessionIdentification, SessionParticipants, SessionParticipantsQuestionAnswered } from "./session"

export interface EmitEvents {
  'instructor:join': (payload: SessionIdentification) => void
  'instructor:leave': (payload: SessionIdentification) => void

  'participant:join': (payload: SessionIdentification) => void
  'participant:leave': (payload: SessionIdentification) => void

  'game:start': (payload: SessionIdentification) => void
  'game:next-step': (payload: SessionIdentification) => void
  'game:question-answer': (payload: QuestionAnswer) => void
}

export interface ListenEvents {
  'game:instructor:participant-join': (
    payload: SessionParticipants,
  ) => void
  'game:instructor:participant-leave': (
    payload: SessionParticipants,
  ) => void
  'game:instructor:update-state': (
    payload: InstructorSessionState,
  ) => void
  'game:instructor:question-answer': (
    payload: SessionParticipantsQuestionAnswered,
  ) => void
  'game:participant:update-state': (
    payload: ParticipantSessionState,
  ) => void
}

export type CustomSocket = Socket<ListenEvents, EmitEvents> & { auth: { access_token?: string } }