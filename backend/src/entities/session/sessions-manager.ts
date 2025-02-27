import { Socket } from 'socket.io'
import { Quiz } from '../quiz/type'
import { MinUser } from '../user/type'
import { Session } from './session'
import { CustomSocket } from '../../socket/types'

export type ActiveSessionEntry = {
  session: Session
  sockets: {
    instructor: CustomSocket | null
    participants: Map<string, Socket>
  }
}

export class SessionsManager {
  private static instance: SessionsManager
  active_sessions: Map<string, ActiveSessionEntry>

  constructor() {
    this.active_sessions = new Map()
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

  instructorEnterSession(code: string, socket: Socket): void {
    const session = this.getSessionEntry(code)
    session.sockets.instructor = socket
  }

  instructorLeaveSession(code: string): void {
    const session = this.getSessionEntry(code)
    session.sockets.instructor = null
  }

  participantEnterSession(code: string, user: MinUser, socket: Socket): void {
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

  static getInstance(): SessionsManager {
    if (!SessionsManager.instance) {
      SessionsManager.instance = new SessionsManager()
    }
    return SessionsManager.instance
  }
}
