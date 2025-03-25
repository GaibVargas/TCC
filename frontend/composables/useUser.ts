import { UserRoles, type User } from "~/types/user"

export const useUser = defineStore('user', {
  state: (): User => ({ public_id: '', name: '', role: UserRoles.PARTICIPANT }),
  actions: {
    setUser(user: User) {
      this.name = user.name
      this.public_id = user.public_id
      this.role = user.role
    }
  },
  persist: { storage: piniaPluginPersistedstate.localStorage() }
})