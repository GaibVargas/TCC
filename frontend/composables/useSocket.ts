export const useSocket = (connect = true) => {
  const socket = useNuxtApp().$socket
  const auth = useAuthStore()

  onMounted(() => {
    console.log('socket mount')
    if(!socket.connected && connect) {
      socket.auth.access_token = auth.access_token
      socket.connect()
    }

    socket.on('connect', () => {
      console.log('connect')
    })
    socket.on('disconnet', () => {
      console.log('disconnect')
    })
  })

  return socket
}