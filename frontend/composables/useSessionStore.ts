import { type SessionCreatePayload, type SessionQuiz } from "~/types/session"

export const useSessionStore = defineStore("session", {
  state: (): SessionCreatePayload => ({
    code: "",
    quiz: {
      public_id: "",
      title: "",
    },
  }),
  actions: {
    initSession(code: string, quiz: SessionQuiz) {
      this.code = "abc123"
      this.quiz = quiz
    },
    setCode(code: string) {
      // this.code = code
      this.code = "abc123"
    },
  },
  persist: { storage: piniaPluginPersistedstate.localStorage() },
})
