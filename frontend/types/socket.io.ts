import { Socket } from "socket.io-client"
import type { InstructorSessionState, ParticipantSessionState, QuestionAnswer, SessionIdentification, SessionParticipants, SessionParticipantsQuestionAnswered } from "./session"

export interface EmitEvents {
  'instructor:connect': (payload: SessionIdentification) => void
  'instructor:disconnect': (payload: SessionIdentification) => void

  'participant:connect': (payload: SessionIdentification) => void
  'participant:disconnect': (payload: SessionIdentification) => void
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
  'game:end': (
    payload: SessionIdentification,
  ) => void
}

export type CustomSocket = Socket<ListenEvents, EmitEvents> & { auth: { access_token?: string } }