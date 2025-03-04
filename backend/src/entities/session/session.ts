import {
  InstructorSessionState,
  ParticipantSessionState,
  SessionStatus,
} from './type'
import { generateRandomString } from '../../utils/string'
import { Quiz } from '../quiz/type'
import { MinUser } from '../user/type'
import { QuizManager } from '../quiz/quiz-manager'
import { CustomSocket } from '../../socket/types'

export class Session {
  code: string
  private instructor: MinUser
  private participants: Map<string, MinUser>
  private quiz_manager: QuizManager
  private status: SessionStatus

  private sockets: {
    instructor: CustomSocket | null
    participants: Map<string, CustomSocket>
  }

  constructor(instructor: MinUser, quiz: Quiz) {
    this.code = generateRandomString(6)
    this.instructor = instructor
    this.participants = new Map()
    this.status = SessionStatus.WAITING_START
    this.quiz_manager = new QuizManager(quiz)
    this.sockets = {
      instructor: null,
      participants: new Map(),
    }
  }

  isValidInstructor(public_id: string): boolean {
    return this.instructor.public_id === public_id
  }

  isValidParticipant(public_id: string): boolean {
    return this.participants.has(public_id)
  }

  start(): void {
    this.status = SessionStatus.SHOWING_QUESTION
    this.sendStateUpdates()
  }

  nextStep(): void {
    switch (this.status) {
      case SessionStatus.WAITING_START:
        this.status = SessionStatus.SHOWING_QUESTION
        this.quiz_manager.startCurrentQuestion()
        break
      case SessionStatus.SHOWING_QUESTION:
        this.status = SessionStatus.FEEDBACK_QUESTION
        break
      case SessionStatus.FEEDBACK_QUESTION:
        this.status = SessionStatus.FEEDBACK_SESSION
        break
      case SessionStatus.FEEDBACK_SESSION:
        const question = this.quiz_manager.getCurrentQuestion()
        const next_question = this.quiz_manager.getNextQuestion()
        if (question.public_id === next_question.public_id) {
          this.status = SessionStatus.ENDING
        } else {
          this.status = SessionStatus.SHOWING_QUESTION
          this.quiz_manager.startCurrentQuestion()
        }
        break
      default:
        break
    }
    this.sendStateUpdates()
  }

  answerQuestion(user_public_id: string, question_public_id: string, answer: string): void {
    if (this.status !== SessionStatus.SHOWING_QUESTION) return
    this.quiz_manager.answerQuestion(user_public_id, question_public_id, answer)
  }

  private getParticipantsId(): string[] {
    return Array.from(this.participants.keys())
  }

  getInstructorState(): InstructorSessionState {
    const base = {
      quiz: this.quiz_manager.getQuiz(),
      code: this.code,
      participants: this.getParticipantsId(),
    }

    if (this.status === SessionStatus.WAITING_START)
      return {
        ...base,
        status: SessionStatus.WAITING_START,
      }

    const question = this.quiz_manager.getCurrentQuestion()
    if (this.status === SessionStatus.SHOWING_QUESTION) {
      return {
        ...base,
        status: SessionStatus.SHOWING_QUESTION,
        question,
        ready_participants:
          this.quiz_manager.getParticipantsThatAnsweredQuestion(
            question.public_id,
          ),
      }
    }

    if (this.status === SessionStatus.FEEDBACK_QUESTION) {
      return {
        ...base,
        status: SessionStatus.FEEDBACK_QUESTION,
        question,
        feedback: this.quiz_manager.getInstructorQuestionFeedback(
          question.public_id,
        ),
      }
    }

    if (this.status === SessionStatus.FEEDBACK_SESSION) {
      return {
        ...base,
        status: SessionStatus.FEEDBACK_SESSION,
        ranking: [
          { name: 'Nome 1', points: 123456 },
          { name: 'Nome 2', points: 12345 },
          { name: 'Nome 3', points: 1234 },
        ],
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

  getParticipantState(user_public_id: string): ParticipantSessionState {
    const base = {
      quiz: this.quiz_manager.getQuiz(),
      code: this.code,
      participants: this.getParticipantsId(),
    }

    if (this.status === SessionStatus.WAITING_START)
      return {
        ...base,
        status: SessionStatus.WAITING_START,
      }

    const question = this.quiz_manager.getCurrentQuestion()
    if (this.status === SessionStatus.SHOWING_QUESTION) {
      return {
        ...base,
        status: SessionStatus.SHOWING_QUESTION,
        question,
        answered: this.quiz_manager.participantHasAnsweredQuestion(
          user_public_id,
          question.public_id,
        ),
      }
    }

    if (this.status === SessionStatus.FEEDBACK_QUESTION) {
      return {
        ...base,
        status: SessionStatus.FEEDBACK_QUESTION,
        question,
        feedback: this.quiz_manager.getParticipantQuestionFeedback(
          user_public_id,
          question.public_id,
        ),
      }
    }

    if (this.status === SessionStatus.FEEDBACK_SESSION) {
      return {
        ...base,
        status: SessionStatus.FEEDBACK_SESSION,
        ranking: [
          { name: 'Nome 1', points: 123456 },
          { name: 'Nome 2', points: 12345 },
          { name: 'Nome 3', points: 1234 },
        ],
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

  private sendStateUpdates(): void {
    this.sockets.instructor?.emit(
      'game:instructor:update-state',
      this.getInstructorState(),
    )
    for (const [
      user_public_id,
      socket,
    ] of this.sockets.participants.entries()) {
      socket.emit(
        'game:participant:update-state',
        this.getParticipantState(user_public_id),
      )
    }
  }

  connectInstructor(socket: CustomSocket): void {
    this.sockets.instructor = socket
  }

  disconnectInstructor(): void {
    this.sockets.instructor = null
  }

  connectParticipant(user_public_id: string, socket: CustomSocket): void {
    this.sockets.participants.set(user_public_id, socket)
  }

  disconnectParticipant(user_public_id: string): void {
    this.sockets.participants.delete(user_public_id)
  }

  addParticipant(user: MinUser): void {
    this.participants.set(user.public_id, user)
  }

  removeParticipant(user: MinUser): void {
    this.participants.delete(user.public_id)
  }
}
