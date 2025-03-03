<script lang="ts" setup>
import { SessionStatus, type InstructorSessionState } from '~/types/session'

const session_store = useSessionStore()
if (!session_store.code) {
  navigateTo('/instructor/quiz')
}

const base_session: InstructorSessionState = {
  code: session_store.code,
  quiz: {
    public_id: session_store.quiz.public_id,
    title: session_store.quiz.title,
  },
  participants: [],
  status: SessionStatus.WAITING_START,
}

const session = ref<InstructorSessionState>(base_session)

function cancel() {
  console.log('Cancel session')
}

const { data, error } = await useApiUseFetch<InstructorSessionState>(`/session/sync/${session_store.code}`)
if (data.value) {
  session.value = data.value
}

const socket = useSocket()
socket.emit('instructor:join', { code: session_store.code })

onMounted(() => {
  socket.on('game:instructor:update-state', (payload) => {
    console.log('from socket', payload)
    session.value = payload
  })
  socket.on('game:instructor:participant-join', (payload) => {
    session.value.participants = payload.participants
  })
  socket.on('game:instructor:participant-leave', (payload) => {
    session.value.participants = payload.participants
  })
})

onBeforeUnmount(() => {
  socket.removeListener('game:instructor:update-state')
  socket.removeListener('game:instructor:participant-join')
  socket.removeListener('game:instructor:participant-leave')
})

function startSession() {
  socket.emit("game:start", { code: session_store.code })
}

function sessionNextStep() {
  socket.emit("game:next-step", { code: session_store.code })
}
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-4 pa-md-8 fill-height flex-column">
    <InstructorSessionEntry v-if="session.status === SessionStatus.WAITING_START" v-bind="session"
      @start="startSession" />
    <InstructorSessionQuestion v-else-if="session.status === SessionStatus.SHOWING_QUESTION" v-bind="session" />
    <InstructorSessionQuestionFeedback v-else-if="session.status === SessionStatus.FEEDBACK_QUESTION"
      v-bind="session" />
    <SessionRanking
      v-else-if="session.status === SessionStatus.FEEDBACK_SESSION || session.status === SessionStatus.ENDING"
      class="flex-fill d-flex flex-column align-center justify-center" :ranking="session.ranking" />
  </v-container>
  <div v-if="session.status !== SessionStatus.WAITING_START"
    class="border-t-thin py-2 w-100 d-flex ga-8 align-center justify-center">
    <v-btn variant="outlined" @click="cancel">Cancelar</v-btn>
    <v-btn color="primary" @click="sessionNextStep">Avançar</v-btn>
  </div>
</template>
