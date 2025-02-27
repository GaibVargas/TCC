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

// export enum SessionStatus {
//   WAITING_START = "waiting-start",
//   SHOWING_QUESTION = "show-question",
//   FEEDBACK_QUESTION = "feedback-question",
//   FEEDBACK_SESSION = "feedback-session",
//   ENDING = "ending",
// }

// export interface SessionQuestionFeedback {
//   given_answer: string
//   correct_answer: string
//   points: number
//   velocity_bonus: number
//   streak_bonus: number
// }

// export interface InstructorSessionQuestionFeedback {
//   correct_answer: string
//   answers: Record<string, string[]>
// }

// interface SessionBaseState {
//   quiz_title: string
// }

// interface InstructorSessionBaseState extends SessionBaseState {
//   participants: String[]
// }

// interface SessionWaitingState extends SessionBaseState {
//   status: SessionStatus.WAITING_START
// }

// interface SessionShowingQuestionState extends SessionBaseState {
//   status: SessionStatus.SHOWING_QUESTION
//   question: SessionQuestion
// }

// export interface InstructorSessionShowingQuestionState
//   extends SessionShowingQuestionState,
//     InstructorSessionBaseState {
//   status: SessionStatus.SHOWING_QUESTION
//   question: SessionQuestion
//   ready_participants: string[]
// }

// interface SessionFeedbackQuestionState extends SessionBaseState {
//   status: SessionStatus.FEEDBACK_QUESTION
//   question: SessionQuestion
//   feedback: SessionQuestionFeedback
// }

// export interface InstructorSessionFeedbackQuestionState
//   extends InstructorSessionBaseState {
//   status: SessionStatus.FEEDBACK_QUESTION
//   question: SessionQuestion
//   feedback: InstructorSessionQuestionFeedback
// }

// interface RankingEntry {
//   name: string
//   points: number
// }

// export interface SessionFeedbackSessionState extends SessionBaseState {
//   status: SessionStatus.FEEDBACK_SESSION | SessionStatus.ENDING
//   ranking: RankingEntry[]
// }

// export type SessionState =
//   | SessionWaitingState
//   | SessionShowingQuestionState
//   | SessionFeedbackQuestionState
//   | SessionFeedbackSessionState

// export type InstructorSessionState =
//   | InstructorSessionShowingQuestionState
//   | InstructorSessionFeedbackQuestionState
//   | SessionFeedbackSessionState

export interface SessionIdentification {
  code: string
}

export interface SessionQuiz {
  public_id: string
  title: string
}

interface QuestionAnswer extends SessionIdentification {
  quiz: SessionQuiz
  question_public_id: string
  answer: string
}

interface SessionParticipants extends SessionIdentification {
  participants: string[]
}

interface SessionParticipantsQuestionAnswered extends SessionIdentification {
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
