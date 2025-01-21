import { z } from 'zod'
import { stubUser, User } from '../../entities/user/type'
import { LTIServices } from '../services'

export const startPayloadSchema = z.object({
  iss: z.string(),
  target_link_uri: z.string().url(),
  login_hint: z.string(),
  lti_message_hint: z.string(),
  client_id: z.string(),
  lti_deployment_id: z.string(),
})

export type StartLaunchPayload = z.infer<typeof startPayloadSchema>

export class MoodleLTIServices implements LTIServices<StartLaunchPayload> {
  async startLaunch(
    payload: StartLaunchPayload,
  ): Promise<string> {
    console.log(payload)
    return await new Promise((resolve) => resolve(payload.target_link_uri))
  }

  async getUser(): Promise<User> {
    return await new Promise((resolve) => resolve(stubUser))
  }

  async sendGrade(user: User, grade: number): Promise<void> {
    await new Promise((resolve) => resolve({ user, grade }))
  }
}
