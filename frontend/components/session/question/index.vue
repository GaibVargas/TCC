<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { SessionQuestion } from '~/types/session'

const props = defineProps<SessionQuestion>()

const answer = ref('')
const was_answer_sended = ref(false)
watch(
  () => props.public_id,
  () => {
    answer.value = ''
    was_answer_sended.value = false
  }
)
function setAnswer(value: string): void {
  answer.value = value
  sendAnswer()
}
function sendAnswer() {
  console.log('send answer', answer.value)
  was_answer_sended.value = true
}
</script>

<template>
  <v-dialog :model-value="was_answer_sended" :close-on-back="false" persistent>
    <v-card class="pa-8">
      <p class="text-body-1 text-center mb-2">Resposta enviada.</p>
      <p class="text-body-2 text-center">Espere o feedback.</p>
    </v-card>
  </v-dialog>
  <v-container fluid class="ma-0 pa-0 flex-fill fill-height flex-column justify-center position-relative">
    <span class="position-absolute top-0 right-0 text-caption">{{ props.question_index }} / {{
      props.total_questions }}</span>
    <p class="position-absolute top-0" v-if="props.time_limit">{{ props.time_limit }}</p>
    <p class="my-auto text-center">{{ props.description }}</p>
    <div v-if="props.type === QuestionType.MULTI_CHOICE || props.type === QuestionType.TRUE_OR_FALSE"
      class="w-100 d-flex ga-2 flex-wrap">
      <SessionQuestionOption v-for="(option, index) in props.options" class="option" :key="option.public_id"
        :prepend="`${alphabet[index]}.`" :description="option.description" :selected="answer === option.public_id"
        :disabled="answer.length > 0" @click="setAnswer(option.public_id)" />
    </div>
    <div v-else class="w-100">
      <v-text-field class="w-100" v-model="answer" variant="outlined" placeholder="resposta" autofocus
        append-inner-icon="mdi-send" :disabled="was_answer_sended" @keyup.enter.prevent="sendAnswer"
        @click:append-inner="sendAnswer"></v-text-field>
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
