import { QuestionType, Quiz } from '../quiz/type'
import { MinUser, UserRoles } from '../user/type'
import { Session } from './session'
import { CustomSocket } from '../../socket/types'

const baseQuiz: Quiz = {
  public_id: 'quiz-id',
  title: 'Quiz teste',
  questions: [
    {
      id: 1,
      public_id: 'quiz-question-1',
      description: 'Questão 1 multi choice',
      correct_text_answer: '',
      time_limit: 60,
      type: QuestionType.MULTI_CHOICE,
      options: [
        {
          public_id: 'option-1',
          description: 'Primeira opção',
          is_correct_answer: true,
        },
        {
          public_id: 'option-2',
          description: 'Segunda opção',
          is_correct_answer: false,
        },
        {
          public_id: 'option-3',
          description: 'Terceira opção',
          is_correct_answer: false,
        },
        {
          public_id: 'option-4',
          description: 'Quarta opção',
          is_correct_answer: false,
        },
      ],
    },
    {
      id: 2,
      public_id: 'quiz-question-2',
      description: 'Questão 2 true false',
      correct_text_answer: '',
      time_limit: null,
      type: QuestionType.TRUE_OR_FALSE,
      options: [
        {
          public_id: 'true-1',
          description: 'Verdadeiro',
          is_correct_answer: true,
        },
        {
          public_id: 'false-2',
          description: 'Falso',
          is_correct_answer: false,
        },
      ],
    },
    {
      id: 3,
      public_id: 'quiz-question-3',
      description: 'Questão 3 text',
      correct_text_answer: 'correto',
      time_limit: null,
      type: QuestionType.TEXT,
      options: [],
    },
  ],
}

export class SessionsManager {
  private static instance: SessionsManager
  active_sessions: Map<string, Session>

  constructor() {
    console.info('SESSION MANAGER INIT')
    this.active_sessions = new Map()
    const session = new Session(
      {
        id: 1,
        public_id: '7be59af8-e47e-476f-b819-218a083f8434',
        name: 'Instrutor teste',
        role: UserRoles.INSTRUCTOR,
      },
      baseQuiz,
    )
    session.setDefaultCode()
    this.active_sessions.set(session.getCode(), session)
  }

  static getInstance(): SessionsManager {
    if (!SessionsManager.instance) {
      SessionsManager.instance = new SessionsManager()
    }
    return SessionsManager.instance
  }

  async newSession(instructor: MinUser, quiz: Quiz, quiz_id: number): Promise<string> {
    const session = await Session.createSession(instructor, quiz, quiz_id)
    const code = session.getCode()
    this.active_sessions.set(code, session)
    return code
  }

  removeSession(code: string): void {
    this.active_sessions.delete(code)
  }

  getSession(code: string): Session {
    const session = this.active_sessions.get(code)
    if (!session) throw new Error('Session not found')
    return session
  }

  instructorEnterSession(code: string, socket: CustomSocket): void {
    const session = this.getSession(code)
    session.connectInstructor(socket)
  }

  instructorLeaveSession(code: string): void {
    const session = this.getSession(code)
    session.disconnectInstructor()
  }

  async participantEnterSession(code: string, user: MinUser, socket: CustomSocket): Promise<void> {
    const session = this.getSession(code)
    await session.addParticipant(user)
    session.connectParticipant(user.public_id, socket)
  }

  participantLeaveSession(code: string, user: MinUser): void {
    const session = this.getSession(code)
    session.removeParticipant(user)
    session.disconnectParticipant(user.public_id)
  }

  async startSession(code: string): Promise<void> {
    const session = this.getSession(code)
    await session.start()
  }

  async sessionNextStep(code: string): Promise<void> {
    const session = this.getSession(code)
    await session.nextStep()
  }
}
