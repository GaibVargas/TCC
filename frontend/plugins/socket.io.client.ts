import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()

  const socket: Socket & { auth: { access_token?: string } } = io(config.public.apiBaseUrl, {
    autoConnect: false,
    auth: {
      access_token: auth.access_token
    }
  })

  socket.on('connect_error', async(error) => {
    console.log(socket.auth)
    if (error.message === 'Authorization token is required') return auth.logout()
    if (error.message === 'Token has expired') {
      const result = await auth.refreshToken()
      if (!result) return auth.logout()
      socket.auth.access_token = auth.access_token
      return socket.connect()
    }
  })

  nuxtApp.provide('socket', socket)
})