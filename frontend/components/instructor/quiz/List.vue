<script lang="ts" setup>
import type { QuizResume } from '~/types/quiz'

interface Props {
  quizzes: QuizResume[]
}
const props = defineProps<Props>()
</script>

<template>
  <ul class="flex-fill list">
    <li v-for="quizz in props.quizzes" :key="quizz.public_id" class="mb-2">
      <InstructorQuizListItem :quiz="quizz" :key="quizz.public_id" />
    </li>
  </ul>
</template>

<style lang="sass" scoped>
.list
  list-style: none
</style>
