import { z } from 'zod'
import { Question, QuestionOption, Quiz } from '../quiz/type'

export enum SessionModes {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export const create_session_payload_schema = z.object({
  quiz_public_id: z.string(),
  mode: z.nativeEnum(SessionModes),
})

export const answer_session_question_schema = z.object({
  question_public_id: z.string(),
  answer: z.string(),
})

export type SessionCreatePayload = {
  code: string
  quiz: Pick<Quiz, "public_id" | "title">
}

export interface SessionIdentification {
  code: string
}

export interface SessionQuiz {
  public_id: string
  title: string
}

export interface SessionParticipants extends SessionIdentification {
  participants: string[]
}

export interface SessionParticipantsQuestionAnswered extends SessionIdentification {
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

interface SessionBaseState extends SessionIdentification, SessionParticipants {
  status: SessionStatus
  quiz: SessionQuiz
}

interface InstructorSessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

interface ParticipantSessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

type SessionQuestionOptions = Pick<QuestionOption, 'public_id' | 'description'>
export interface SessionQuestion
  extends Pick<Question, 'id' | 'public_id' | 'description' | 'type' | 'time_limit'> {
  options: SessionQuestionOptions[]
  index: number
  total: number
  startedAt: number // Date in ms
}

interface InstructorSessionShowingQuestionState extends SessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
  ready_participants: string[]
}

interface ParticipantSessionShowingQuestionState extends Omit<
  InstructorSessionShowingQuestionState,
  'ready_participants'
> {
  answered: boolean
}

export interface InstructorSessionQuestionFeedback {
  correct_answer: string
  answers: Record<string, string[]>
}

interface InstructorSessionFeedbackQuestionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: InstructorSessionQuestionFeedback
}

export interface ParticipantSessionQuestionFeedback {
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

export type RankingType = {
  rank: string
  players: RankingEntry[]
}[]

interface SessionFeedbackSessionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
  ranking: RankingType
}

export type InstructorSessionState =
  | InstructorSessionWaitingState
  | InstructorSessionShowingQuestionState
  | InstructorSessionFeedbackQuestionState
  | SessionFeedbackSessionState

export type ParticipantSessionState =
  | ParticipantSessionWaitingState
  | ParticipantSessionShowingQuestionState
  | ParticipantSessionFeedbackQuestionState
  | SessionFeedbackSessionState

