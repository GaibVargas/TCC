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
      this.code = code
      this.quiz = quiz
    },
  },
  persist: { storage: piniaPluginPersistedstate.localStorage() },
})
