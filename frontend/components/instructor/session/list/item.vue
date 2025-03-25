<script lang="ts" setup>
import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { SessionGradesStatus, type SessionItem } from '~/types/session'

interface Props {
  session: SessionItem
  is_active?: boolean
}
const props = defineProps<Props>()
const is_active = computed(() => props.is_active ?? false)
const session_date = computed(() => {
  const date = new TZDate(props.session.updatedAt, "America/Sao_Paulo")
  return format(date, 'dd/MM/yyyy')
})

const grades_sended = ref(false)
const were_grades_send = computed(() => grades_sended.value || props.session.grades_status === SessionGradesStatus.SENDED)
const are_grades_loading = ref(false)
async function sendGrades() {
  const confirmed = await useNuxtApp().$confirm({
    title: "Envio de notas",
    message: "Tem certeza de que deseja enviar as notas dos participantes ao Moodle?",
    confirmText: "Sim",
  })

  if (!confirmed) return
  const toast = useNuxtApp().$toast
  try {
    are_grades_loading.value = true
    await useApiFetch(`/session/send-grades/${props.session.code}`, {
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

const is_loading_end_session = ref(false)
async function endSession() {
  const confirmed = await useNuxtApp().$confirm({
    title: "Encerramento de sessão",
    message: "Tem certeza de que deseja encerrar sessão?",
    confirmText: "Sim",
  })

  if (!confirmed) return
  const toast = useNuxtApp().$toast
  try {
    is_loading_end_session.value = true
    await useApiFetch(`/session/early-end/${props.session.public_id}`, {
      method: 'POST'
    })
    toast.success('Sessão encerrada!')
  } catch (error) {
    console.error('Error early ending session', error)
    toast.error('Erro ao encerrar sessão. Tente novamente mais tarde.')
  } finally {
    is_loading_end_session.value = false
  }
}

function goToSession() {
  if (!props.is_active) return
  const session_store = useSessionStore()
  session_store.initSession(props.session.code, {
    public_id: props.session.quiz.public_id,
    title: props.session.quiz.title,
  })
  navigateTo('/instructor/session/game')
}
</script>

<template>
  <div class="pa-4 border-thin border-opacity-50 rounded d-flex justify-space-between" :class="{ 'active': is_active }"
    @click.stop="goToSession">
    <div class="content d-flex align-center">
      <p class="text-body-1 d-inline-block mr-4">{{ props.session.quiz.title }}</p>
      <span class="d-inline-block text-caption mr-4">{{ session_date }}</span>
      <span class="d-inline-block text-caption mr-4">{{ props.session.participants }} participantes</span>
    </div>
    <div v-if="!is_active" class="actions">
      <v-btn size="small" color="primary" flat v-if="!were_grades_send" class="mr-4" :loading="are_grades_loading"
        @click.stop="sendGrades">Enviar notas</v-btn>
      <v-btn size="small" color="primary" @click.stop="navigateTo(`/instructor/session/report/${props.session.public_id}`)">
        Relatório
      </v-btn>
    </div>
    <div v-else>
      <v-btn size="small" color="primary" class="mr-4 w-100" :loading="is_loading_end_session"
        @click.stop="endSession">Encerrar sessão</v-btn>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.active
  border: 2px solid #23FFAB !important
  background-color: #E0FFF3
  cursor: pointer
</style>
