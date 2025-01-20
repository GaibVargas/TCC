import { User } from '../user/type'

export interface LTIServices {
  startLaunch(): Promise<string>
  getUser(): Promise<User>
  sendGrade(user: User, grade: number): Promise<void>
}
