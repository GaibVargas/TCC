import type { QuizPayload } from "./quiz"
import type { User } from "./user"

export enum SessionModes {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export interface Session {
  code: string
  participants: User[]
  quiz: QuizPayload | null
}

export type SessionCreatePayload = {
  code: string
  quiz: QuizPayload
}