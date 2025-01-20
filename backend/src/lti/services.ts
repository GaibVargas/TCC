import { User } from '../entities/user/type'

export interface LTIServices {
  startLaunch(): Promise<string>
  getUser(): Promise<User>
  sendGrade(user: User, grade: number): Promise<void>
}
