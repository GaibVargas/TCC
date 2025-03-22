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

const socket = useSocket()
socket.emit('instructor:connect', { code: session_store.code })

const { data, error } = await useApiUseFetch<InstructorSessionState>(`/session/sync/${session_store.code}`)
if (error.value) {
  navigateTo('/instructor/quiz')
}
if (data.value) {
  session.value = data.value
}

onMounted(() => {
  socket.on('game:instructor:participant-join', (payload) => {
    if (session.value.code !== payload.code) return
    session.value.participants = payload.participants
  })
  socket.on('game:instructor:participant-leave', (payload) => {
    if (session.value.code !== payload.code) return
    session.value.participants = payload.participants
  })
  socket.on('game:instructor:update-state', (payload) => {
    if (session.value.code !== payload.code) return
    loadingStart.value = false
    loadingNextStep.value = false
    session.value = payload
  })
  socket.on("game:instructor:question-answer", (payload) => {
    if (session.value.status !== SessionStatus.SHOWING_QUESTION) return
    if (session.value.question.public_id !== payload.question_public_id) return
    session.value.ready_participants = payload.ready_participants
  })
  socket.on('game:end', (payload) => {
    console.log('game end', payload)
    if (session.value.code !== payload.code) return
    loadingEndSession.value = false
    useNuxtApp().$toast.info("Sessão encerrada")
    session_store.$reset()
    navigateTo('/instructor/session')
    socket.disconnect()
  })
})

onBeforeUnmount(() => {
  socket.removeListener('game:instructor:participant-join')
  socket.removeListener('game:instructor:participant-leave')
  socket.removeListener('game:instructor:update-state')
  socket.removeListener('game:instructor:question-answer')
  socket.removeListener('game:end')
})

const loadingStart = ref(false)
async function startSession() {
  try {
    loadingStart.value = true
    await useApiFetch(`/session/start/${session.value.code}`, {
      method: 'POST'
    })
  } catch (error) {
    console.error(error)
    useNuxtApp().$toast.error('Erro ao abrir sessão. Tente novamente mais tarde')
  }
}

const loadingNextStep = ref(false)
async function sessionNextStep() {
  try {
    loadingNextStep.value = true
    await useApiFetch(`/session/next-step/${session.value.code}`, {
      method: 'POST'
    })
  } catch (error) {
    console.error(error)
    useNuxtApp().$toast.error('Erro ao continuar sessão. Tente novamente mais tarde')
  } finally {
    loadingNextStep.value = false
  }
}

const loadingEndSession = ref(false)
async function endSession() {
  try {
    const confirmed = await useNuxtApp().$confirm({
      title: "Confirmação de encerramento de sessão",
      message: "Tem certeza de que deseja encerrar sessão?",
      confirmText: "Sim",
    })

    if (!confirmed) return

    loadingEndSession.value = true
    await useApiFetch(`/session/early-end/${session.value.code}`, {
      method: 'POST'
    })
  } catch (error) {
    console.error(error)
    useNuxtApp().$toast.error('Erro ao encerrar sessão. Tente novamente mais tarde')
  }
}

const ranking_label = computed(() => {
  if (session.value.status === SessionStatus.ENDING) return 'Ranking Final'
  if (session.value.status === SessionStatus.FEEDBACK_SESSION) return `Ranking Top ${session.value.ranking.length}`
  return ''
})
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-4 pa-md-8 fill-height flex-column">
    <InstructorSessionEntry v-if="session.status === SessionStatus.WAITING_START" v-bind:session="session"
      :loading="loadingStart" @start="startSession" />
    <InstructorSessionQuestion v-else-if="session.status === SessionStatus.SHOWING_QUESTION" v-bind="session" />
    <InstructorSessionQuestionFeedback v-else-if="session.status === SessionStatus.FEEDBACK_QUESTION"
      v-bind="session" />
    <SessionRanking
      v-else-if="session.status === SessionStatus.FEEDBACK_SESSION || session.status === SessionStatus.ENDING"
      class="flex-fill d-flex flex-column align-center justify-center" :ranking="session.ranking"
      :label="ranking_label" />
    <div v-else class="text-center">Sessão desconhecida</div>
  </v-container>
  <div v-if="session.status !== SessionStatus.WAITING_START"
    class="border-t-thin py-2 w-100 d-flex ga-8 align-center justify-center">
    <v-btn variant="outlined" @click="endSession" :loading="loadingEndSession"
      :disabled="loadingNextStep">Encerrar</v-btn>
    <v-btn color="primary" @click="sessionNextStep" :loading="loadingNextStep" :disabled="loadingEndSession">{{
      session.status ===
        SessionStatus.ENDING ? 'Encerrar' : 'Avançar' }}</v-btn>
  </div>
</template>
