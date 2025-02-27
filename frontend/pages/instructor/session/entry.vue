<script lang="ts" setup>
definePageMeta({
  middleware: 'is-instructor',
})

const session = useSessionStore()
const socket = useSocket()
socket.emit('instructor:join', { code: session.code })

const participants = ref<string[]>([])
onMounted(() => {
  socket.on('game:instructor:participant-join', (payload) => {
    participants.value = payload.participants
  })
  socket.on('game:instructor:participant-leave', (payload) => {
    participants.value = payload.participants
  })
})

onBeforeUnmount(() => {
  socket.removeListener('game:instructor:participant-join')
  socket.removeListener('game:instructor:participant-leave')
})
</script>

<template>
  <v-container fluid class="ma-0 pa-4 flex-fill d-flex flex-column align-center justify-center">
    <h2 class="mb-16 text-h4">{{ session.quiz.title }}</h2>
    <p class="text-body-1">Código para entrar no quiz game</p>
    <h1 class="text-h1 font-weight-bold mt-4 mb-16">{{ session.code }}</h1>
    <p class="text-body-1 mb-16">{{ participants.length }} participantes</p>
    <div class="btns d-flex ga-4">
      <v-btn variant="outlined">Cancelar</v-btn>
      <v-btn color="primary">Iniciar</v-btn>
    </div>
  </v-container>
</template>
