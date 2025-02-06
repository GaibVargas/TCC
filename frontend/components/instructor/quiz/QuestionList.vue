<script lang="ts" setup>
import type { Question } from '~/types/quiz'

interface Props {
  questions: Question[]
  highlightedQuestionIndex: number
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'questionSelect', questionIndex: number): void
  (e: 'quesionRemove', questionId: string): void
}>()
</script>

<template>
  <ul class="list">
    <li v-for="(question, index) in props.questions">
      <InstructorQuizQuestionListItem :question="question" :highlight="index === props.highlightedQuestionIndex"
        :key="question.id" @click.stop="emit('questionSelect', index)"
        @question-remove="v => emit('quesionRemove', v)" />
    </li>
  </ul>
</template>

<style lang="sass" scoped>
.list
  list-style: none
</style>
