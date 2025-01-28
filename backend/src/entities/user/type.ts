import { z } from 'zod'

export enum UserRoles {
  INSTRUCTOR = 'instructor',
  PARTICIPANT = 'participant',
}

const lmsSchema = z.object({
  user_id: z.string(),
  iss: z.string().url(),
  platform: z.enum(['moodle']),
  version: z.string(),
  client_id: z.string(),
  outcome: z.object({
    source_id: z.string(),
    service_url: z.string().url(),
  })
})

const rolesSchema = z.enum([UserRoles.INSTRUCTOR, UserRoles.PARTICIPANT])

export type Roles = z.infer<typeof rolesSchema>

export const userSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  role: rolesSchema,
  locale: z.string(),
  lms: lmsSchema,  
})

export type User = z.infer<typeof userSchema>

export const stubUser: User = {
  id: 1,
  name: 'Stub',
  role: UserRoles.PARTICIPANT,
  locale: 'pt-br',
  lms: {
    user_id: '1',
    iss: 'http://localhost/moodle',
    platform: 'moodle',
    version: '1.3.0',
    client_id: '1',
    outcome: {
      source_id: 'source_id',
      service_url: 'http://localhost/moodle'
    }
  }
}
