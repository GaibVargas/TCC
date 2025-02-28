<script lang="ts" setup>
import { SessionStatus, type InstructorSessionState } from '~/types/session'

definePageMeta({
  middleware: 'is-instructor',
})

const session = useSessionStore()
if (!session.code) {
  navigateTo('/instructor/quiz')
}

const participants = ref<string[]>([])
const { data, error } = await useApiUseFetch<InstructorSessionState>(`/session/sync/${session.code}`)
if (data.value && data.value.status !== SessionStatus.WAITING_START) {
  navigateTo('/instructor/session/game')
}
if (data.value) {
  participants.value = data.value.participants
}

const socket = useSocket()
socket.emit('instructor:join', { code: session.code })

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

function startSession() {
  socket.emit('game:start', { code: session.code })
  navigateTo('/instructor/session/game')
}
</script>

<template>
  <v-container fluid class="ma-0 pa-4 flex-fill d-flex flex-column align-center justify-center">
    <h2 class="mb-16 text-h4">{{ session.quiz.title }}</h2>
    <p class="text-body-1">Código para entrar no quiz game</p>
    <h1 class="text-h1 font-weight-bold mt-4 mb-16">{{ session.code }}</h1>
    <p class="text-body-1 mb-16">{{ participants.length }} participantes</p>
    <div class="btns d-flex ga-4">
      <v-btn variant="outlined">Cancelar</v-btn>
      <v-btn color="primary" @click="startSession">Iniciar</v-btn>
    </div>
  </v-container>
</template>
