import { generateRandomString } from '../../utils/string'
import { Quiz } from '../quiz/type'
import { MinUser } from '../user/type'

export enum SessionStates {
  WAITING_START = 'waiting-start',
  SHOWING_QUESTION = 'show-question',
  FEEDBACK_QUESTION = 'feedback-question',
  FEEDBACK_SESSION = 'feedback-session',
  ENDING = 'ending',
  PAUSED = 'paused',
}

export class Session {
  code: string
  instructor: MinUser
  participants: Map<string, MinUser>
  quiz: Quiz
  state: SessionStates
  current_question: number

  constructor(instructor: MinUser, quiz: Quiz) {
    this.code = generateRandomString(6)
    this.instructor = instructor
    this.quiz = quiz
    this.participants = new Map()
    this.state = SessionStates.WAITING_START
    this.current_question = 0
  }

  addParticipant(user: MinUser): void {
    this.participants.set(user.public_id, user)
  }

  removeParticipant(user: MinUser): void {
    this.participants.delete(user.public_id)
  }
}
