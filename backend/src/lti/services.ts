import { CreateUserPayload, User } from '../entities/user/type'

export interface LTIServices {
  startLaunch(payload: unknown): Promise<string>
  getUser(payload: unknown): Promise<CreateUserPayload>
  sendGrade(user: User, grade: number): Promise<void>
}
