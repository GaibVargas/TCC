import { stubUser, User } from '../../entities/user/type'
import { LTIServices } from '../services'

export class MoodleLTIServices implements LTIServices {
  async startLaunch(): Promise<string> {
    return await new Promise((resolve) => resolve(''))
  }

  async getUser(): Promise<User> {
    return await new Promise((resolve) => resolve(stubUser))
  }

  async sendGrade(user: User, grade: number): Promise<void> {
    await new Promise((resolve) => resolve({ user, grade }))
  }
}
