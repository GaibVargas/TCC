<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { SessionQuestion } from '~/types/session'

const props = defineProps<SessionQuestion>()

function sendAnswer() {
  console.log('send answer')
}
</script>

<template>
  <v-container fluid class="ma-0 pa-0 flex-fill fill-height flex-column justify-center position-relative">
    <p class="position-absolute top-0" v-if="props.time_limit">{{ props.time_limit }}</p>
    <p class="my-auto">{{ props.description }}</p>
    <div v-if="props.type === QuestionType.MULTI_CHOICE || props.type === QuestionType.TRUE_OR_FALSE"
      class="w-100 d-flex ga-2 flex-wrap">
      <SessionQuestionOption v-for="(option, index) in props.options" class="option" :key="option.public_id"
        :prepend="`${alphabet[index]}.`" :description="option.description" />
    </div>
    <div v-else class="w-100">
      <v-text-field class="w-100" variant="outlined" placeholder="resposta" autofocus append-inner-icon="mdi-send" @click:append-inner="sendAnswer"></v-text-field>
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
