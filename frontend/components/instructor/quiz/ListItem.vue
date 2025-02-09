<script lang="ts" setup>
import type { QuizResume } from '~/types/quiz'

interface Props {
  quiz: QuizResume
}
const props = defineProps<Props>()

function removeQuiz() {
  console.log('Remove quiz', props.quiz.public_id)
}

function openQuizSession() {
  console.log('Open session quiz', props.quiz.public_id)
}

function editQuiz() {
  navigateTo(`/instructor/quiz/${props.quiz.public_id}`)
  console.log('Edit quiz', props.quiz.public_id)
}
</script>

<template>
  <div class="pa-4 border-thin border-opacity-50 rounded cursor-pointer d-flex justify-space-between" @click="editQuiz">
    <div class="content">
      <p class="text-body-1 d-inline-block mr-4">{{ props.quiz.title }}</p>
      <span class="d-inline-block">{{ props.quiz.n_questions }} perguntas</span>
    </div>
    <div class="actions">
      <v-btn size="small" color="primary" flat v-if="props.quiz.can_open_session" class="mr-4" @click.stop="openQuizSession">Abrir seção</v-btn>
      <v-btn size="small" flat @click.stop="removeQuiz">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>
  </div>
</template>
