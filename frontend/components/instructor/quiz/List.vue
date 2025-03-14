<script lang="ts" setup>
import type { Paginated } from '~/types/pagination'
import type { QuizResume } from '~/types/quiz'
import type { SessionCreatePayload, SessionModes } from '~/types/session'

const page_size = 10
const page = ref(1)
const total_items = computed(() => {
  if (!data.value?.count) return 0
  return data.value.count
})
const n_pages = computed(() => Math.ceil(total_items.value / page_size))

const { data, status, refresh } = await useApiUseFetch<Paginated<QuizResume[]>>('/quiz', {
  lazy: true,
  query: {
    page,
    page_size,
  }
})

const is_pagination_loading = ref(false)

const computed_status = computed(() => {
  if (is_pagination_loading.value) return 'loading-page'
  return status.value
})

watch(page, async (_) => {
  is_pagination_loading.value = true
  await refresh()
  is_pagination_loading.value = false
})

const show_open_session_dialog = ref(false)
const quiz_to_be_open = ref<QuizResume | null>(null)

function showOpenSession(quiz_resume: QuizResume) {
  quiz_to_be_open.value = quiz_resume
  show_open_session_dialog.value = true
}

function hideOpenSession() {
  show_open_session_dialog.value = false
  quiz_to_be_open.value = null
}

const loading_open_session = ref(false)

async function openSession(mode: SessionModes | null) {
  const toast = useNuxtApp().$toast
  if (!quiz_to_be_open.value) {
    hideOpenSession()
    return
  }
  try {
    loading_open_session.value = true
    const session = await useApiFetch<SessionCreatePayload>('/session', {
      method: 'POST',
      body: {
        mode,
        quiz_public_id: quiz_to_be_open.value.public_id,
      }
    })
    if (!session) {
      toast.error('Erro ao criar sessão para o quiz. Tente novamente mais tarde.')
      return
    }
    const session_store = useSessionStore()
    session_store.initSession(session.code, {
      public_id: session.quiz.public_id,
      title: session.quiz.title,
    })
    navigateTo('/instructor/session/game')
    hideOpenSession()
  } catch (error) {
    console.error(error)
    toast.error('Erro ao criar sessão para o quiz. Tente novamente mais tarde.')
  } finally {
    loading_open_session.value = false
  }
}

function cancelOpenSession() {
  hideOpenSession()
}
</script>

<template>
  <v-alert variant="outlined" v-if="computed_status === 'pending' || computed_status === 'idle'">
    <p>
      <v-progress-circular color="primary" indeterminate size="20" class="mr-4"></v-progress-circular>
      Buscando quizzes...
    </p>
  </v-alert>
  <v-alert v-else-if="computed_status === 'error'" color="error">Erro ao buscar seus quizzes.</v-alert>
  <v-alert v-else-if="computed_status === 'success' && !data?.items?.length">Você não possui quizzes criados.</v-alert>
  <v-container v-else-if="data" fluid class="ma-0 pa-0">
    <ul class="flex-fill list">
      <li v-for="quizz in data.items" :key="quizz.public_id" class="mb-2">
        <InstructorQuizListItem :quiz="quizz" :key="quizz.public_id" @remove="refresh"
          @open-session="showOpenSession(quizz)" />
      </li>
    </ul>
    <div class="d-flex align-center justify-center">
      <v-pagination v-model="page" :length="n_pages" :disabled="is_pagination_loading" density="compact"
        total-visible="4"></v-pagination>
      <v-progress-circular v-show="is_pagination_loading" color="primary" indeterminate size="20"
        class="ml-4"></v-progress-circular>
    </div>
  </v-container>
  <v-dialog v-model="show_open_session_dialog" persistent>
    <InstructorOpenSessionDialog v-if="quiz_to_be_open" :quiz-title="quiz_to_be_open?.title" :loading="loading_open_session"
      @cancel="cancelOpenSession" @open="openSession" />
  </v-dialog>
</template>

<style lang="sass" scoped>
.list
  list-style: none
</style>
