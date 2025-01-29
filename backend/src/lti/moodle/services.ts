import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import { CreateUserPayload, User } from '../../entities/user/type'
import { LTIServices } from '../services'
import { signMessage, verifyMessage, verifyMessageOnISS } from './jwt'
import moodleUris from './links'
import { LTI_REDIRECT_URL } from '../constants'
import { MoodleUser } from './types'
import { getUserRole } from '../../entities/user/services'

export const startLauchPayloadSchema = z.object({
  iss: z.string(),
  target_link_uri: z.string().url(),
  login_hint: z.string(),
  lti_message_hint: z.string(),
  client_id: z.string(),
  lti_deployment_id: z.string(),
})

export type StartLaunchPayload = z.infer<typeof startLauchPayloadSchema>

export const getUserPayloadSchema = z.object({
  id_token: z.string(),
  state: z.string(),
})

export type GetUserPayload = z.infer<typeof getUserPayloadSchema>

export class MoodleLTIServices implements LTIServices {
  async startLaunch(
    payload: unknown,
  ): Promise<string> {
    const parsedPayload = startLauchPayloadSchema.parse(payload)
    const { iss, target_link_uri, login_hint, lti_message_hint, client_id, lti_deployment_id } = parsedPayload
    const state = await signMessage({
      iss,
      target_link_uri,
      login_hint,
      lti_message_hint,
      client_id,
      lti_deployment_id
    })
    const moodleOidcUrl = moodleUris(iss).auth
    const nonce = randomBytes(16).toString('hex')
    const redirectUrl =
      `${moodleOidcUrl}?` +
      `client_id=${encodeURIComponent(client_id)}&` +
      `redirect_uri=${encodeURIComponent(LTI_REDIRECT_URL)}&` +
      `response_type=id_token&` +
      `scope=openid&` + 
      `state=${encodeURIComponent(state)}&` +
      `login_hint=${encodeURIComponent(login_hint)}&` +
      `lti_message_hint=${encodeURIComponent(lti_message_hint)}&` +
      `nonce=${encodeURIComponent(nonce)}&` +
      `response_mode=form_post`

    return redirectUrl
  }

  private formatUser(moodleUser: MoodleUser): CreateUserPayload {
    return {
      name: moodleUser.name,
      locale: moodleUser['https://purl.imsglobal.org/spec/lti/claim/launch_presentation'].locale,
      role: getUserRole(moodleUser['https://purl.imsglobal.org/spec/lti/claim/roles']),
      lms: {
        iss: moodleUser.iss,
        platform: 'moodle',
        client_id: moodleUser.aud,
        version: moodleUser['https://purl.imsglobal.org/spec/lti/claim/version'],
        user_id: moodleUser.sub,
        outcome: {
          source_id: moodleUser['https://purl.imsglobal.org/spec/lti-bo/claim/basicoutcome'].lis_result_sourcedid,
          service_url: moodleUser['https://purl.imsglobal.org/spec/lti-bo/claim/basicoutcome'].lis_outcome_service_url,
        }
      }
    }
  }

  async getUser(payload: unknown): Promise<CreateUserPayload> {
    const parsedPayload = getUserPayloadSchema.parse(payload)
    const state = await verifyMessage(parsedPayload.state) as StartLaunchPayload
    const user = await verifyMessageOnISS(parsedPayload.id_token, state.iss) as MoodleUser
    return this.formatUser(user)
  }

  async sendGrade(user: User, grade: number): Promise<void> {
    await new Promise((resolve) => resolve({ user, grade }))
  }
}
