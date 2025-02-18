import type {
  PublicId,
  QuestionGeneric,
  QuestionOptionPayload,
  QuizPayload,
} from "./quiz"
import type { User } from "./user"

export enum SessionModes {
  INDIVIDUAL = "individual",
  GROUP = "group",
}

export type ConnectionStatus = "connected" | "disconnected"

export interface Session {
  code: string
  participants: User[]
  quiz: QuizPayload | null
  connection_status: ConnectionStatus
}

export type SessionCreatePayload = {
  code: string
  quiz: QuizPayload
}

export enum SessionStatus {
  WAITING_START = "waiting-start",
  SHOWING_QUESTION = "show-question",
  FEEDBACK_QUESTION = "feedback-question",
  FEEDBACK_SESSION = "feedback-session",
  ENDING = "ending",
}

export interface SessionQuestionOption
  extends Pick<QuestionOptionPayload, "public_id" | "description"> {}

export interface SessionQuestion
  extends PublicId,
    Pick<
      QuestionGeneric<SessionQuestionOption>,
      "description" | "type" | "options" | "time_limit"
    > {
  question_index: number
  total_questions: number
  startedAt: number // Date in ms
}

export interface SessionQuestionFeedback {
  given_answer: string
  correct_answer: string
  points: number
  velocity_bonus: number
  streak_bonus: number
}

interface SessionBaseState {
  quiz_title: string
}


interface SessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

interface SessionShowingQuestionState extends SessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
}

interface SessionFeedbackQuestionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: SessionQuestionFeedback
}

interface RankingEntry {
  name: string
  points: number
}

interface SessionFeedbackSessionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
  ranking: RankingEntry[]
}

export type SessionState =
  | SessionWaitingState
  | SessionShowingQuestionState
  | SessionFeedbackQuestionState
  | SessionFeedbackSessionState
