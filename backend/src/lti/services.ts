import { User } from '../entities/user/type'

export interface LTIServices {
  startLaunch(payload: unknown): Promise<string>
  getUser(payload: unknown): Promise<User>
  sendGrade(user: User, grade: number): Promise<void>
}
