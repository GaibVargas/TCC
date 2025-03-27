<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { SessionQuestion } from '~/types/session'

const props = defineProps<{
  question: SessionQuestion
  hasAnswered: boolean
}>()

const answer = ref('')
const sended = ref(false)
const was_answer_sended = computed(() => sended.value || props.hasAnswered)

watch(
  () => props.question.public_id,
  () => {
    answer.value = ''
    sended.value = false
  }
)

function setAnswer(value: string): void {
  answer.value = value
  sendAnswer()
}

const session = useSessionStore()
async function sendAnswer() {
  sended.value = true
  try {
    await useApiFetch(`/session/answer/${session.code}`, {
      method: 'POST',
      body: {
        question_public_id: props.question.public_id,
        answer: answer.value.trim()
      }
    })    
  } catch (error) {
    console.error(error)
    useNuxtApp().$toast.error('Erro desconhecido ao responder questão.')
    sended.value = false
  }
}

const { remaining_time } = useCountdownTimer(props.question.startedAt, props.question.time_limit)
</script>

<template>
  <v-dialog :model-value="was_answer_sended" :close-on-back="false" persistent>
    <v-card class="pa-8">
      <p class="text-body-1 text-center mb-2">Resposta enviada.</p>
      <p class="text-body-2 text-center">Espere o feedback.</p>
    </v-card>
  </v-dialog>
  <v-container fluid class="ma-0 pa-0 flex-fill fill-height flex-column justify-center position-relative">
    <span class="position-absolute top-0 right-0 text-caption">{{ props.question.index }} / {{
      props.question.total }}</span>
    <p class="position-absolute top-0" v-if="props.question.time_limit">{{ remaining_time }}</p>
    <p class="my-auto text-center">{{ props.question.description }}</p>
    <div v-if="props.question.type === QuestionType.MULTI_CHOICE || props.question.type === QuestionType.TRUE_OR_FALSE"
      class="w-100 d-flex ga-2 flex-wrap">
      <SessionQuestionOption v-for="(option, index) in props.question.options" class="option" :key="option.public_id"
        :prepend="`${alphabet[index]}.`" :description="option.description" :selected="answer === option.public_id"
        :disabled="was_answer_sended" @click="setAnswer(option.public_id)" />
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
