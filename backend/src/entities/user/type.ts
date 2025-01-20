import { z } from 'zod'

const lmsSchema = z.object({
  user_id: z.string(),
  platform: z.enum(['moodle']),
  version: z.enum(['1.0', '1.3']),
  client_id: z.string(),
  outcome: z.object({
    source_id: z.string(),
    service_url: z.string().url(),
  })
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['student', 'instructor']),
  locale: z.string(),
  lms: lmsSchema,  
})

export type User = z.infer<typeof userSchema>

export const stubUser: User = {
  id: '1',
  name: 'Stub',
  role: 'student',
  locale: 'pt-br',
  lms: {
    user_id: '1',
    platform: 'moodle',
    version: '1.3',
    client_id: '1',
    outcome: {
      source_id: 'source_id',
      service_url: 'http://localhost/moodle'
    }
  }
}