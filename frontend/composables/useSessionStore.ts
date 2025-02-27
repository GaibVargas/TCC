import { SessionStatus, type SessionQuiz, type SessionState } from "~/types/session"

export const useSessionStore = defineStore("session", {
  state: (): SessionState => ({
    code: "",
    participants: [],
    status: SessionStatus.WAITING_START,
    quiz: {
      public_id: '',
      title: '',
    },
  }),
  actions: {
    initSession(code: string, quiz: SessionQuiz) {
      this.code = code
      this.quiz = quiz
    },
    updateParticipants(participants: string[]) {
      this.participants = participants
    },
  },
  persist: { storage: piniaPluginPersistedstate.localStorage() },
})
