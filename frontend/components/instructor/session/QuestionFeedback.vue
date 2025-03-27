<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { InstructorSessionFeedbackQuestionState } from '~/types/session'

const props = defineProps<InstructorSessionFeedbackQuestionState>()

const n_text_correct_answers = computed(() => {
  if (props.question.type !== QuestionType.TEXT) return 0
  return props.feedback.answers[props.feedback.correct_answer.toLocaleLowerCase()]?.length ?? 0
})

function getOptionNAnswers(option_public_id: string) {
  return props.feedback.answers[option_public_id]?.length ?? 0
}
</script>

<template>
  <v-container fluid class="ma-0 pa-0 flex-fill fill-height flex-column justify-center position-relative">
    <span class="position-absolute top-0 right-0 text-caption">{{ props.question.index }} / {{
      props.question.total }}</span>
    <div class="d-flex align-center justify-center">
      <v-icon size="small" class="mr-2">mdi-account</v-icon>
      <span class="text-body-1">{{ props.participants.length }}</span>
    </div>
    <p class="my-auto text-center">{{ props.question.description }}</p>
    <div v-if="props.question.type === QuestionType.MULTI_CHOICE || props.question.type === QuestionType.TRUE_OR_FALSE"
      class="w-100 d-flex ga-2 flex-wrap justify-space-around" :style="{ minHeight: '40vh' }">
      <InstructorSessionQuestionOptionFeedbackItem v-for="(option, index) in props.question.options"
        :key="option.public_id" :prepend="`${alphabet[index]}.`" :description="option.description"
        :total="props.participants.length" :n_answers="getOptionNAnswers(option.public_id)"
        :is_correct="props.feedback.correct_answer === option.public_id" />
    </div>
    <p v-else class="text-body-1 py-8 border-thin rounded w-100 text-center font-weight-bold correct">
      <span class="font-weight-regular mr-4">{{ n_text_correct_answers }}</span>
      {{ props.feedback.correct_answer }}
    </p>
  </v-container>
</template>

<style lang="sass" scoped>
.option
  --gap: 8px
  width: calc(50% - var(--gap) / 2)
  @media (max-width: 960px)
    width: 100%
.correct
  border-color: rgb(var(--v-theme-success)) !important
  background-color: rgba(var(--v-theme-success), .1) !important
</style>
