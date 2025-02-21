<script lang="ts" setup>
// definePageMeta({
//   middleware: 'is-instructor',
// })

// const user = useUser()
// const session = useSessionStore()
// const socket = useSocket()
// socket.emit('instructor:join', { session_code: session.code, user_public_id: user.public_id })

// onMounted(() => {
//   socket.on('new-participant', () => {
//     session.addParticipant(user)
//   })
// })
const session = ref({
  quiz_title: 'título do quiz',
  code: 'code123',
  participants: [
    { public_id: '1' },
    { public_id: '2' },
    { public_id: '3' },
  ]
})
</script>

<template>
  <v-container fluid class="ma-0 pa-4 flex-fill d-flex flex-column align-center justify-center">
    <h2 class="mb-16 text-h4">{{ session.quiz_title }}</h2>
    <p class="text-body-1">Código para entrar no quiz game</p>
    <h1 class="text-h1 font-weight-bold mt-4 mb-16">{{ session.code }}</h1>
    <p class="text-body-1 mb-16">{{ session.participants.length }} participantes</p>
    <div class="btns d-flex ga-4">
      <v-btn variant="outlined">Cancelar</v-btn>
      <v-btn color="primary">Iniciar</v-btn>
    </div>
  </v-container>
</template>
