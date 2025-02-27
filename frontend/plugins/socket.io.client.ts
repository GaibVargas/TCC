import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'

let refreshPromise: (() => Promise<boolean>) | null = null

export type CustomSocket = Socket & { auth: { access_token?: string } }

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const auth = useAuthStore()
  const router = useRouter()

  const socket: CustomSocket = io(config.public.apiBaseUrl, {
    autoConnect: false,
    auth: {
      access_token: auth.access_token
    }
  })

  socket.on('connect_error', async(error) => {
    console.log(socket.auth)
    if (error.message === 'Authorization token is required') {
      console.log('Auth is required')
      auth.logout()
      router.push('/')
      return
    }
    if (error.message === 'Token has expired') {
      console.log('Refreshing')
      if (!refreshPromise) refreshPromise = auth.refreshToken
      if (refreshPromise) {
        const result = await refreshPromise()
        if (!result) return auth.logout()
        socket.auth.access_token = auth.access_token
        return socket.connect()
      }
    }
    console.log('socket error', error)
  })

  nuxtApp.provide('socket', socket)
})