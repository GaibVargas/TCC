import type { QuizPayload } from "~/types/quiz"
import type { ConnectionStatus, Session } from "~/types/session"
import type { User } from "~/types/user"

export const useSessionStore = defineStore('session', {
  state: (): Session => ({ code: '', participants: [], quiz: null, connection_status: 'disconnected' }),
  actions: {
    initSession(code: string, quiz: QuizPayload) {
      this.code = code
      this.quiz = quiz
    },
    addParticipant(participant: User) {
      this.participants.push(participant)
    },
    setConnectionStatus(status: ConnectionStatus) {
      console.log(status)
      this.connection_status = status
    }
  },
  persist: { storage: piniaPluginPersistedstate.localStorage() }
})