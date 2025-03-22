<script lang="ts" setup>
import type { QuizResume } from '~/types/quiz'

interface Props {
  quiz: QuizResume
}
const props = defineProps<Props>()

const quiz_title = computed(() => {
  if (!props.quiz.title.length) return 'Títutlo do quiz'
  return props.quiz.title
})
const quiz_n_questions_description = computed(() => {
  let description = `${props.quiz.n_questions} pergunta`
  if (props.quiz.n_questions > 1) description += 's'
  return description
})

const emit = defineEmits<{
  (e: 'remove'): void
  (e: 'open-session'): void
}>()

const remove_loading = ref(false)
async function removeQuiz() {
  const confirmed = await useNuxtApp().$confirm({
    title: "Confirmação de remoção de quiz",
    message: "Tem certeza de que deseja remover esse quiz?",
    confirmText: "Sim",
  })

  if (!confirmed) return
  const toast = useNuxtApp().$toast
  try {
    remove_loading.value = true
    await useApiFetch(`/quiz/${props.quiz.public_id}`, {
      method: 'DELETE'
    })
    toast.success('Quiz removido!')
    emit('remove')
  } catch (error) {
    console.error('Error deleting quiz', error)
    toast.error('Erro ao remover quiz. Tente novamente mais tarde.')
  } finally {
    remove_loading.value = false
  }
}

function editQuiz() {
  if (remove_loading.value) return
  navigateTo(`/instructor/quiz/edit/${props.quiz.public_id}`)
}
</script>

<template>
  <div class="pa-4 border-thin rounded d-flex justify-space-between"
    :class="[remove_loading ? 'border-opacity' : 'border-opacity-50 cursor-pointer']" @click="editQuiz">
    <div class="content d-flex align-center" :class="{ 'text-disabled': remove_loading }">
      <p class="text-body-1 d-inline-block mr-4">{{ quiz_title }}</p>
      <span class="d-inline-block text-caption">{{ quiz_n_questions_description }}</span>
    </div>
    <div class="actions">
      <v-btn size="small" color="primary" flat v-if="props.quiz.can_open_session" class="mr-4"
        :disabled="remove_loading" @click.stop="emit('open-session')">Abrir seção</v-btn>
      <v-btn size="small" flat :loading="remove_loading" @click.stop="removeQuiz">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>
