import { Quiz } from '../quiz/type'
import { MinUser } from '../user/type'
import { Session } from './session'

export class SessionsManager {
  private static instance: SessionsManager
  active_sessions: Map<string, Session>

  constructor() {
    this.active_sessions = new Map()
  }

  newSession(instructor: MinUser, quiz: Quiz): string {
    const session = new Session(instructor, quiz)
    this.active_sessions.set(session.code, session)
    return session.code
  }

  removeSession(code: string): void {
    this.active_sessions.delete(code)
  }

  getSession(code: string): Session {
    const session = this.active_sessions.get(code)
    if (!session) {
      throw new Error('Session not found')
    }
    return session
  }

  userEnterSession(code: string, user: MinUser): void {
    const session = this.getSession(code)
    session.addParticipant(user)
  }

  userLeaveSession(code: string, user: MinUser): void {
    const session = this.getSession(code)
    session.removeParticipant(user)
  }
  
  static getInstance(): SessionsManager {
    if (!SessionsManager.instance) {
      SessionsManager.instance = new SessionsManager()
    }
    return SessionsManager.instance
  }
}
