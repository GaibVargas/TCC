import { Server, Socket } from 'socket.io'
import { MinUser } from '../entities/user/type'
import { EventsMap } from 'socket.io/dist/typed-events'
import { Question, QuestionOption } from '../entities/quiz/type'

export interface SessionIdentification {
  code: string
}

interface SessionQuiz {
  public_id: string
  title: string
}

interface QuestionAnswer extends SessionIdentification {
  quiz: SessionQuiz
  question_public_id: string
  answer: string
}

export interface ClientToServerEvents {
  'instructor:join': (payload: SessionIdentification) => Promise<void>
  'instructor:leave': (payload: SessionIdentification) => Promise<void>

  'participant:join': (payload: SessionIdentification) => Promise<void>
  'participant:leave': (payload: SessionIdentification) => Promise<void>

  'game:start': (payload: SessionIdentification) => Promise<void>
  'game:next-step': (payload: SessionIdentification) => Promise<void>
  'game:question-answer': (payload: QuestionAnswer) => Promise<void>
}

interface SessionParticipants extends SessionIdentification {
  participants: string[]
}

interface SessionParticipantsQuestionAnswered extends SessionIdentification {
  question_public_id: string
  ready_participants: string[]
}

export enum SessionStatus {
  WAITING_START = 'waiting-start',
  SHOWING_QUESTION = 'show-question',
  FEEDBACK_QUESTION = 'feedback-question',
  FEEDBACK_SESSION = 'feedback-session',
  ENDING = 'ending',
}

interface SessionBaseState
  extends SessionIdentification,
    SessionParticipants,
    SessionQuiz {
  status: SessionStatus
}

interface InstructorSessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

interface ParticipantSessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

type SessionQuestionOptions = Pick<QuestionOption, 'public_id' | 'description'>
interface SessionQuestion
  extends Pick<Question, 'public_id' | 'description' | 'type' | 'time_limit'> {
  options: SessionQuestionOptions
  index: number
  total: number
  startedAt: number // Date in ms
}

interface InstructorSessionShowingQuestionState extends SessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
  ready_participants: string[]
}

type ParticipantSessionShowingQuestionState = Omit<
  InstructorSessionShowingQuestionState,
  'ready_participants'
>

interface InstructorSessionQuestionFeedback {
  correct_answer: string
  answers: Record<string, string[]>
}

interface InstructorSessionFeedbackQuestionState
  extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: InstructorSessionQuestionFeedback
}

interface ParticipantSessionQuestionFeedback {
  given_answer: string
  correct_answer: string
  is_correct: boolean
  points: number
  velocity_bonus: number
  streak_bonus: number
}

interface ParticipantSessionFeedbackQuestionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: ParticipantSessionQuestionFeedback
}

interface RankingEntry {
  name: string
  points: number
}

interface SessionFeedbackSessionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
  ranking: RankingEntry[]
}

type InstructorSessionState =
  | InstructorSessionWaitingState
  | InstructorSessionShowingQuestionState
  | InstructorSessionFeedbackQuestionState
  | SessionFeedbackSessionState

type ParticipantSessionState =
  | ParticipantSessionWaitingState
  | ParticipantSessionShowingQuestionState
  | ParticipantSessionFeedbackQuestionState
  | SessionFeedbackSessionState

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
