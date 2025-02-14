import { defineNuxtPlugin } from '#app'
import { io, Socket } from 'socket.io-client'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const socket: Socket = io(config.public.apiBaseUrl, {
    autoConnect: false,
  })

  nuxtApp.provide('socket', socket)
})