<script lang="ts" setup>
const user = useUser()
const session = useSessionStore()
const socket = useSocket()
socket.emit('join', { session_code: session.code, user_public_id: user.public_id })

onMounted(() => {
  socket.on('new-participant', () => {
    session.addParticipant(user)
  })
})
</script>

<template>
  <h1>Sessão</h1>
  <h1>{{ session.quiz?.title }}</h1>
  <p>{{ session.participants.length }} participantes</p>
</template>
