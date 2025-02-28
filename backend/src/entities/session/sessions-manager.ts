import { QuestionType, Quiz } from '../quiz/type'
import { MinUser, UserRoles } from '../user/type'
import { Session } from './session'
import { CustomSocket } from '../../socket/types'

const baseQuiz: Quiz = {
  public_id: 'quiz-id',
  title: 'Quiz teste',
  questions: [
    {
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
      public_id: 'quiz-question-3',
      description: 'Questão 3 text',
      correct_text_answer: 'correto',
      time_limit: null,
      type: QuestionType.TEXT,
      options: [],
    },
  ],
}

export type ActiveSessionEntry = {
  session: Session
  sockets: {
    instructor: CustomSocket | null
    participants: Map<string, CustomSocket>
  }
}

export class SessionsManager {
  private static instance: SessionsManager
  active_sessions: Map<string, ActiveSessionEntry>

  constructor() {
    console.info('SESSION MANAGER INIT')
    this.active_sessions = new Map()
    const session = new Session(
      {
        public_id: '7be59af8-e47e-476f-b819-218a083f8434',
        name: 'Instrutor teste',
        role: UserRoles.INSTRUCTOR,
      },
      baseQuiz,
    )
    session.code = 'abc123'
    this.active_sessions.set(session.code, this.newSessionEntry(session))
  }

  static getInstance(): SessionsManager {
    if (!SessionsManager.instance) {
      SessionsManager.instance = new SessionsManager()
    }
    return SessionsManager.instance
  }

  private newSessionEntry(session: Session): ActiveSessionEntry {
    return {
      session,
      sockets: {
        instructor: null,
        participants: new Map(),
      },
    }
  }

  newSession(instructor: MinUser, quiz: Quiz): string {
    const session = new Session(instructor, quiz)
    this.active_sessions.set(session.code, this.newSessionEntry(session))
    return session.code
  }

  removeSession(code: string): void {
    this.active_sessions.delete(code)
  }

  getSessionEntry(code: string): ActiveSessionEntry {
    const session = this.active_sessions.get(code)
    if (!session) {
      throw new Error('Session not found')
    }
    return session
  }

  getSession(code: string): Session {
    return this.getSessionEntry(code).session
  }

  instructorEnterSession(code: string, socket: CustomSocket): void {
    const session = this.getSessionEntry(code)
    session.sockets.instructor = socket
  }

  instructorLeaveSession(code: string): void {
    const session = this.getSessionEntry(code)
    session.sockets.instructor = null
  }

  participantEnterSession(code: string, user: MinUser, socket: CustomSocket): void {
    const session = this.getSessionEntry(code)
    session.session.addParticipant(user)
    session.sockets.participants.set(user.public_id, socket)
    session.sockets.instructor?.emit('game:instructor:participant-join', {
      code: session.session.code,
      participants: Array.from(session.session.participants.keys()),
    })
  }

  participantLeaveSession(code: string, user: MinUser): void {
    const session = this.getSessionEntry(code)
    session.session.removeParticipant(user)
    session.sockets.participants.delete(user.public_id)
    session.sockets.instructor?.emit('game:instructor:participant-leave', {
      code: session.session.code,
      participants: Array.from(session.session.participants.keys()),
    })
  }

  startSession(code: string): void {
    const session = this.getSessionEntry(code)
    session.session.start()
    this.sendStateUpdates(session)
  }

  sendStateUpdates(session: ActiveSessionEntry): void {
    session.sockets.instructor?.emit(
      'game:instructor:update-state',
      session.session.getInstructorState(),
    )
    for (const participantSocket of session.sockets.participants.values()) {
      participantSocket.emit(
        'game:participant:update-state',
        session.session.getParticipantState(),
      )
    }
  }
}
