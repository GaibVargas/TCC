import type { QuizPayload } from "~/types/quiz"
import type { Session } from "~/types/session"
import type { User } from "~/types/user"

export const useSessionStore = defineStore('session', {
  state: (): Session => ({ code: '', participants: [], quiz: null }),
  actions: {
    initSession(code: string, quiz: QuizPayload) {
      this.code = code
      this.quiz = quiz
    },
    addParticipant(participant: User) {
      this.participants.push(participant)
    }
  }
})