export const useAuthStore = defineStore('auth', {
  state: () => ({ access_token: '', refresh_token: '' }),
  actions: {
    setAccessToken(token: string) {
      console.log('set token', token)
      this.access_token = token
    },
    setRefreshToken(token: string) {
      console.log('oto token', token)
      this.refresh_token = token
    }
  }
})