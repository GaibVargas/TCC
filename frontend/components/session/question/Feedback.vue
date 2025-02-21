<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { SessionQuestion, SessionQuestionFeedback } from '~/types/session'

const props = defineProps<{
  question: SessionQuestion
  feedback: SessionQuestionFeedback
}>()

const is_correct_answer = computed(() => props.feedback.correct_answer.toLocaleLowerCase() === props.feedback.given_answer.toLocaleLowerCase())
</script>

<template>
  <v-container fluid class="ma-0 pa-0 flex-fill fill-height flex-column justify-center position-relative">
    <span class="position-absolute top-0 right-0 text-caption">{{ props.question.question_index }} / {{
      props.question.total_questions }}</span>
    <div v-if="is_correct_answer"
      class="position-absolute top-0 d-flex flex-column align-center justify-center py-4 px-8 rounded feedback">
      <v-icon color="success" size="x-large">mdi-check</v-icon>
      <p class="font-weight-bold">+{{ props.feedback.points }} pts</p>
      <p class="font-weight-bold" v-if="props.feedback.velocity_bonus > 0">+{{ props.feedback.velocity_bonus }} pts
        muito rápido!</p>
      <p class="font-weight-bold" v-if="props.feedback.streak_bonus > 0">+{{ props.feedback.streak_bonus }} pts
        sequência de acertos!</p>
    </div>
    <div v-else
      class="position-absolute top-0 d-flex flex-column align-center justify-center py-4 px-8 rounded feedback">
      <v-icon color="error" size="x-large">mdi-close</v-icon>
      <p>Que pena</p>
      <p>Você não pontuou nessa pergunta</p>
      <p>:(</p>
    </div>
    <p class="my-auto text-center">{{ props.question.description }}</p>
    <div v-if="props.question.type === QuestionType.MULTI_CHOICE || props.question.type === QuestionType.TRUE_OR_FALSE"
      class="w-100 d-flex ga-2 flex-wrap">
      <SessionQuestionOption v-for="(option, index) in props.question.options" class="option" :key="option.public_id"
        :prepend="`${alphabet[index]}.`" :description="option.description"
        :correct="props.feedback.correct_answer === option.public_id"
        :incorrect="!is_correct_answer && props.feedback.given_answer === option.public_id" disabled />
    </div>
    <div v-else class="w-100">
      <p class="text-center py-4 border-thin rounded" :class="[is_correct_answer ? 'correct' : 'incorrect']">{{
        props.feedback.given_answer }}</p>
      <p class="mt-2 text-center py-4 border-thin rounded correct" v-if="!is_correct_answer">{{ props.feedback.correct_answer }}
      </p>
    </div>
  </v-container>
</template>

<style lang="sass" scoped>
.option
  --gap: 8px
  width: calc(50% - var(--gap) / 2)
  @media (max-width: 960px)
    width: 100%
.feedback
  background-color: #f8f9faee
.correct
  border-color: rgb(var(--v-theme-success)) !important
  background-color: rgba(var(--v-theme-success), .1) !important
.incorrect
  border-color: rgb(var(--v-theme-error)) !important
  background-color: rgba(var(--v-theme-error), .1) !important
</style>
