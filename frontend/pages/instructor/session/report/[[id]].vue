<script lang="ts" setup>
import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { QuestionType } from '~/types/quiz'
import { SessionGradesStatus, SessionStatus, type SessionReport } from '~/types/session'

definePageMeta({
  middleware: 'is-instructor',
  layout: 'instructor',
})

const route = useRoute()
const { id } = route.params
if (!id) {
  navigateTo('/instructor/session')
}

const tab = ref("question")

const session = ref<SessionReport | null>()

const { data, error, status } = await useApiUseFetch<SessionReport>(`/session/report/view/${id}`, {
  lazy: true,
})
watch(data, (newData) => {
  if (!newData && !error.value) return
  session.value = newData
})

const session_createdAt = computed(() => {
  if (!session.value) return ''
  const date = new TZDate(session.value.createdAt, "America/Sao_Paulo")
  return format(date, 'dd/MM/yyyy HH:mm')
})
const session_updatedAt = computed(() => {
  if (!session.value) return ''
  const date = new TZDate(session.value.updatedAt, "America/Sao_Paulo")
  return format(date, 'dd/MM/yyyy HH:mm')
})

const toast = useNuxtApp().$toast
const are_grades_loading = ref(false)
const grades_sended = ref(false)
const were_grades_send = computed(() => grades_sended.value || session.value?.grades_status === SessionGradesStatus.SENDED)
async function sendGrades() {
  if (!session.value) return
  const confirmed = await useNuxtApp().$confirm({
    title: "Envio de notas",
    message: "Tem certeza de que deseja enviar as notas dos participantes ao Moodle?",
    confirmText: "Sim",
  })

  if (!confirmed) return
  try {
    are_grades_loading.value = true
    await useApiFetch(`/session/send-grades/${session.value.code}`, {
      method: 'POST'
    })
    grades_sended.value = true
    toast.success('Notas enviadas!')
  } catch (error) {
    console.error('Error sendind grades', error)
    toast.error('Erro ao enviar notas. Tente novamente mais tarde.')
  } finally {
    are_grades_loading.value = false
  }
}

const is_loading_report = ref(false)
async function getSessionReport() {
  if (!session.value) return
  try {
    is_loading_report.value = true
    await delay(1000)
    toast.success('Relatório pronto. Verifique a aba de downloads.')
  } catch (error) {
    toast.error('Erro ao gerar relatório. Tente novamente mais tarde.')
  } finally {
    is_loading_report.value = false
  }
}
</script>

<template>
  <v-container v-if="status === 'success' && session" fluid class="ma-0 pa-sm-2 pa-md-8 mb-16">
    <div class="d-flex justify-space-between mb-6">
      <div class="title">
        <h1 class="text-h3 font-weight-bold mb-2">{{ session.quiz.title }}</h1>
        <p class="text-subtitle-2">Iniciado em: {{ session_createdAt }}</p>
        <p class="text-subtitle-2">Última atualização em: {{ session_updatedAt }}</p>
      </div>
      <div class="actions d-flex flex-column ga-2">
        <v-btn v-if="!were_grades_send" variant="outlined" density="compact" :loading="are_grades_loading"
          @click.stop="sendGrades">Enviar
          notas</v-btn>
        <v-btn variant="outlined" density="compact" :loading="is_loading_report" @click.stop="getSessionReport">Gerar
          relatório</v-btn>
      </div>
    </div>
    <v-tabs v-model="tab" density="compact" selected-class="active-tab">
      <v-tab value="question">Questões</v-tab>
      <v-tab value="participant">Participantes</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item value="question">
        <InstructorSessionQuestionsTable :session="session" />
      </v-tabs-window-item>
      <v-tabs-window-item value="participant">
        <InstructorSessionParticipantsTable :session="session" />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
  <v-container v-else-if="status === 'error'" fluid class="d-flex align-center justify-center">
    <v-alert color="error">Erro ao buscar sessão.</v-alert>
  </v-container>
  <v-container v-else fluid class="d-flex align-center justify-center">
    <v-alert variant="outlined">
      <p>
        <v-progress-circular color="primary" indeterminate size="20" class="mr-4"></v-progress-circular>
        Buscando sessão...
      </p>
    </v-alert>
  </v-container>
</template>

<style lang="sass" scoped>
.active-tab
  font-weight: bolder
</style>
