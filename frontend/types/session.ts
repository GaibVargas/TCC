import type {
  PublicId,
  QuestionGeneric,
  QuestionOptionPayload,
  QuestionType,
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
  PAUSED = "paused",
}

export interface SessionQuestionOption
  extends Pick<QuestionOptionPayload, "public_id" | "description"> {}

export interface SessionQuestion
  extends PublicId,
    Pick<
      QuestionGeneric<SessionQuestionOption>,
      "description" | "type" | "options" | "time_limit"
    > {
  startedAt: number // Date in ms
}

interface SessionQuestionFeedback {
  given_answer: string
  correct_answer: string
}

interface SessionBaseState {
  quiz_title: string
}

interface SessionWaitingState extends SessionBaseState {
  status: SessionStatus.PAUSED | SessionStatus.WAITING_START
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
