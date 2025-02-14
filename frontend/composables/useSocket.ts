export const useSocket = () => {
  onMounted(() => {
    const socket = useNuxtApp().$socket
    if(!socket.connected)
      socket.connect()
  })

  const socket = useNuxtApp().$socket
  return socket
}