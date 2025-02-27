<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { InstructorSessionShowingQuestionState } from '~/types/session'

const props = defineProps<InstructorSessionShowingQuestionState>()
</script>

<template>
  <v-container fluid class="ma-0 pa-0 flex-fill fill-height flex-column justify-center position-relative">
    <span class="position-absolute top-0 right-0 text-caption">{{ props.question.index }} / {{
      props.question.total }}</span>
    <div class="d-flex align-center">
      <v-icon size="small" class="mr-2">mdi-account</v-icon>
      <span class="text-caption">{{ props.ready_participants.length }} / {{ props.participants.length }}</span>
    </div>
    <p v-if="props.question.time_limit" class="mt-8">{{ props.question.time_limit }}</p>
    <p class="my-auto text-center">{{ props.question.description }}</p>
    <div v-if="props.question.type === QuestionType.MULTI_CHOICE || props.question.type === QuestionType.TRUE_OR_FALSE"
      class="w-100 d-flex ga-2 flex-wrap">
      <SessionQuestionOption v-for="(option, index) in props.question.options" class="option" :key="option.public_id"
        :prepend="`${alphabet[index]}.`" :description="option.description" disabled />
    </div>
    <div v-else class="w-100">
      <div class="w-100 py-6 border-thin border-opacity-50 rounded"></div>
    </div>
  </v-container>
</template>

<style lang="sass" scoped>
.option
  --gap: 8px
  width: calc(50% - var(--gap) / 2)
  @media (max-width: 960px)
    width: 100%
</style>
