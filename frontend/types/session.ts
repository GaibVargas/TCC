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

export interface InstructorSessionQuestionFeedback {
  correct_answer: string
  answers: Record<string, string[]>
}

interface SessionBaseState {
  quiz_title: string
}

interface InstructorSessionBaseState extends SessionBaseState {
  participants: String[]
}

interface SessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

interface SessionShowingQuestionState extends SessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
}

export interface InstructorSessionShowingQuestionState
  extends SessionShowingQuestionState,
    InstructorSessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
  ready_participants: string[]
}

interface SessionFeedbackQuestionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: SessionQuestionFeedback
}

export interface InstructorSessionFeedbackQuestionState
  extends InstructorSessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: InstructorSessionQuestionFeedback
}

interface RankingEntry {
  name: string
  points: number
}

export interface SessionFeedbackSessionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
  ranking: RankingEntry[]
}

export type SessionState =
  | SessionWaitingState
  | SessionShowingQuestionState
  | SessionFeedbackQuestionState
  | SessionFeedbackSessionState

export type InstructorSessionState =
  | InstructorSessionShowingQuestionState
  | InstructorSessionFeedbackQuestionState
  | SessionFeedbackSessionState
