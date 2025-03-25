import type {
  PublicId,
  Question,
  QuestionOptionPayload,
  QuestionType,
  Quiz,
  QuizPayload,
  QuizReportView,
} from "./quiz"
import type { User } from "./user"

export enum SessionModes {
  INDIVIDUAL = "individual",
  GROUP = "group",
}

export type SessionCreatePayload = {
  code: string
  quiz: Pick<QuizPayload, "public_id" | "title">
}

export interface SessionIdentification {
  code: string
}

export interface SessionQuiz {
  public_id: string
  title: string
}

export interface QuestionAnswer extends SessionIdentification {
  quiz: SessionQuiz
  question_public_id: string
  answer: string
}

export interface SessionParticipants extends SessionIdentification {
  participants: string[]
}

export interface SessionParticipantsQuestionAnswered
  extends SessionIdentification {
  question_public_id: string
  ready_participants: string[]
}

export enum SessionStatus {
  WAITING_START = "waiting-start",
  SHOWING_QUESTION = "show-question",
  FEEDBACK_QUESTION = "feedback-question",
  FEEDBACK_SESSION = "feedback-session",
  ENDING = "ending",
  FINISHED = "finished",
}

interface SessionBaseState extends SessionIdentification, SessionParticipants {
  status: SessionStatus
  quiz: SessionQuiz
}

export interface InstructorSessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

export interface ParticipantSessionWaitingState extends SessionBaseState {
  status: SessionStatus.WAITING_START
}

type SessionQuestionOptions = Pick<
  QuestionOptionPayload,
  "public_id" | "description"
>
export interface SessionQuestion
  extends PublicId,
    Pick<Question, "description" | "type" | "time_limit"> {
  options: SessionQuestionOptions[]
  index: number
  total: number
  startedAt: number // Date in ms
}

export interface InstructorSessionShowingQuestionState
  extends SessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
  ready_participants: string[]
}

interface ParticipantSessionShowingQuestionState
  extends Omit<InstructorSessionShowingQuestionState, "ready_participants"> {
  answered: boolean
}

interface InstructorSessionQuestionFeedback {
  correct_answer: string
  answers: Record<string, string[]>
}

export interface InstructorSessionFeedbackQuestionState
  extends SessionBaseState {
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

export interface ParticipantSessionFeedbackQuestionState
  extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: ParticipantSessionQuestionFeedback
}

interface RankingEntry {
  name: string
  points: number
}

export type Ranking = {
  rank: string
  players: RankingEntry[]
}[]

export interface SessionFeedbackSessionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
  ranking: Ranking
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

export type SessionState = InstructorSessionState | ParticipantSessionState

export enum SessionGradesStatus {
  NOT_SENDED = "not-sended",
  SENDED = "sended",
  ERROR = "error",
}
export type SessionItem = {
  public_id: string
  code: string
  quiz: {
    public_id: string
    title: string
  }
  participants: number
  grades_status: SessionGradesStatus
  updatedAt: Date
}

type UserSessionReport = Pick<User, "public_id" | "name">
type AnswerSessionReport = {
  value: string
  player: {
    user: UserSessionReport
  }
  given_answer: string
  is_correct: boolean
}
type QuestionSessionReport = {
  public_id: string
  type: QuestionType
  description: string
  time_limit: number | null
  correct_text_answer: string
  is_deleted: boolean
  answers: AnswerSessionReport[]
  correct_answer_percentage: number
}
type QuizSessionReport = {
  public_id: string
  title: string
  is_deleted: boolean
  questions: QuestionSessionReport[]
}
type PlayerSessionReport = {
  grade: number
  score: number
  user: UserSessionReport
}
export type SessionReport = {
  public_id: string
  code: string
  status: SessionStatus
  grades_status: SessionGradesStatus
  quiz: QuizSessionReport
  players: PlayerSessionReport[]
  createdAt: Date
  updatedAt: Date
}
