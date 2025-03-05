export const useSocket = (connect = true) => {
  const socket = useNuxtApp().$socket
  const auth = useAuthStore()

  onMounted(() => {
    if(!socket.connected && connect) {
      socket.auth.access_token = auth.access_token
      socket.connect()
    }

    socket.on('connect', () => {
      console.log('connect')
    })
    socket.on('disconnect', () => {
      console.log('disconnect')
    })
  })

  return socket
}