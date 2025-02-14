import { z } from 'zod'
import { Quiz } from '../quiz/type'

export enum SessionModes {
  INDIVIDUAL = 'individual',
  GROUP = 'group',
}

export const create_session_payload_schema = z.object({
  quiz_public_id: z.string(),
  mode: z.nativeEnum(SessionModes),
})

export type SessionCreatePayload = {
  code: string
  quiz: Quiz
}
