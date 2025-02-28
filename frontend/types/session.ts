import type {
  PublicId,
  Question,
  QuestionOptionPayload,
  QuizPayload,
} from "./quiz"

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

export interface SessionParticipantsQuestionAnswered extends SessionIdentification {
  question_public_id: string
  ready_participants: string[]
}

export enum SessionStatus {
  WAITING_START = "waiting-start",
  SHOWING_QUESTION = "show-question",
  FEEDBACK_QUESTION = "feedback-question",
  FEEDBACK_SESSION = "feedback-session",
  ENDING = "ending",
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

export interface InstructorSessionShowingQuestionState extends SessionBaseState {
  status: SessionStatus.SHOWING_QUESTION
  question: SessionQuestion
  ready_participants: string[]
}

export type ParticipantSessionShowingQuestionState = Omit<
  InstructorSessionShowingQuestionState,
  "ready_participants"
>

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

export interface ParticipantSessionFeedbackQuestionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_QUESTION
  question: SessionQuestion
  feedback: ParticipantSessionQuestionFeedback
}

interface RankingEntry {
  name: string
  points: number
}

export interface SessionFeedbackSessionState extends SessionBaseState {
  status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
  ranking: RankingEntry[]
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
