import { CreateUserPayload, SessionPlayer } from '../entities/user/type'

export interface LTIServices {
  startLaunch(payload: unknown): Promise<string>
  getUser(payload: unknown): Promise<CreateUserPayload>
  sendGrade(session_player: SessionPlayer[]): Promise<void>
}
