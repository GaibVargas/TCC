import {
  InstructorSessionState,
  ParticipantSessionState,
  SessionStatus,
} from './type'
import { generateRandomString } from '../../utils/string'
import { Quiz } from '../quiz/type'
import { MinUser } from '../user/type'

type QuestionAnswer = {
  user: {
    public_id: string
  },
  giver_answer: string
}

type QuestionsData = {
  public_id: string
  startedAt: number
  answers: QuestionAnswer[]
}

export class Session {
  code: string
  instructor: MinUser
  participants: Map<string, MinUser>
  quiz: Quiz
  status: SessionStatus
  current_question: number
  questions_data: Map<string, QuestionsData>

  constructor(instructor: MinUser, quiz: Quiz) {
    this.code = generateRandomString(6)
    this.instructor = instructor
    this.quiz = quiz
    this.participants = new Map()
    this.status = SessionStatus.WAITING_START
    this.current_question = 0
    this.questions_data = new Map()
  }

  start(): void {
    this.current_question = 0
    this.status = SessionStatus.SHOWING_QUESTION
    const question = this.quiz.questions[this.current_question]
    this.questions_data.set(question.public_id, {
      public_id: question.public_id,
      startedAt: Date.now(),
      answers: []
    })
  }

  getParticipantsId(): string[] {
    return Array.from(this.participants.keys())
  }

  getInstructorState(): InstructorSessionState {
    const base = {
      quiz: this.quiz,
      code: this.code,
      participants: this.getParticipantsId(),
    }

    if (this.status === SessionStatus.WAITING_START)
      return {
        ...base,
        status: SessionStatus.WAITING_START,
      }

    if (this.status === SessionStatus.SHOWING_QUESTION) {
      const question = this.quiz.questions[this.current_question]
      return {
        ...base,
        status: SessionStatus.SHOWING_QUESTION,
        question: {
          public_id: question.public_id,
          description: question.description,
          type: question.type,
          time_limit: question.time_limit,
          options: question.options.map((o) => ({
            public_id: o.public_id,
            description: o.description,
          })),
          index: this.current_question,
          total: this.quiz.questions.length,
          startedAt: this.questions_data.get(question.public_id)?.startedAt ?? 0,
        },
        ready_participants: [],
      }
    }

    return {
      ...base,
      status: SessionStatus.ENDING,
      ranking: [
        { name: 'Nome 1', points: 123456 },
        { name: 'Nome 2', points: 12345 },
        { name: 'Nome 3', points: 1234 },
      ],
    }
  }

  getParticipantState(): ParticipantSessionState {
    const base = {
      quiz: this.quiz,
      code: this.code,
      participants: this.getParticipantsId(),
    }

    if (this.status === SessionStatus.WAITING_START)
      return {
        ...base,
        status: SessionStatus.WAITING_START,
      }

    if (this.status === SessionStatus.SHOWING_QUESTION) {
      const question = this.quiz.questions[this.current_question]
      return {
        ...base,
        status: SessionStatus.SHOWING_QUESTION,
        question: {
          public_id: question.public_id,
          description: question.description,
          type: question.type,
          time_limit: question.time_limit,
          options: question.options.map((o) => ({
            public_id: o.public_id,
            description: o.description,
          })),
          index: this.current_question,
          total: this.quiz.questions.length,
          startedAt: this.questions_data.get(question.public_id)?.startedAt ?? 0,
        },
      }
    }

    return {
      ...base,
      status: SessionStatus.ENDING,
      ranking: [
        { name: 'Nome 1', points: 123456 },
        { name: 'Nome 2', points: 12345 },
        { name: 'Nome 3', points: 1234 },
      ],
    }
  }

  addParticipant(user: MinUser): void {
    this.participants.set(user.public_id, user)
  }

  removeParticipant(user: MinUser): void {
    this.participants.delete(user.public_id)
  }
}
