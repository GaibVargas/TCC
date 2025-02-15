import type { QuizPayload } from "./quiz"
import type { User } from "./user"

export enum SessionModes {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export type ConnectionStatus = 'connected' | 'disconnected'

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