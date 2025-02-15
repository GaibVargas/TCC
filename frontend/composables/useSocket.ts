export const useSocket = (connect = true) => {
  const socket = useNuxtApp().$socket
  const session = useSessionStore()

  onMounted(() => {
    console.log('socket mount')
    if(!socket.connected && connect)
      socket.connect()

    socket.on('connect', () => {
      console.log('aaaa')
      session.setConnectionStatus('connected')
    })
    socket.on('disconnet', () => {
      session.setConnectionStatus('disconnected')
    })
  })

  return socket
}