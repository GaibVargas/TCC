import { User } from '../entities/user/type'

export interface LTIServices <StartLaunchPayloadType> {
  startLaunch(payload: StartLaunchPayloadType): Promise<string>
  getUser(): Promise<User>
  sendGrade(user: User, grade: number): Promise<void>
}
