<script lang="ts" setup>
import { QuestionType } from '~/types/quiz';
import { SessionStatus, type ParticipantSessionState } from '~/types/session'

const session = ref<ParticipantSessionState>({
  code: 'asdfg',
  quiz: {
    public_id: 'id-quiz',
    title: 'Título do quiz'
  },
  participants: [],
  status: SessionStatus.WAITING_START,
})

function goToWaiting() {
  session.value = {
    code: 'asdfg',
    quiz: {
      public_id: 'id-quiz',
      title: 'Título do quiz'
    },
    participants: [],
    status: SessionStatus.WAITING_START,
  }
}

function goToShowMultiQuestion() {
  session.value = {
    code: 'asdfg',
    quiz: {
      public_id: 'id-quiz',
      title: 'Título do quiz'
    },
    participants: [],
    status: SessionStatus.SHOWING_QUESTION,
    question: {
      public_id: unique_id(),
      description: 'Título da questão',
      time_limit: null,
      type: QuestionType.MULTI_CHOICE,
      options: [
        { public_id: 'id-manual-1', description: 'Opção 1' },
        { public_id: 'id-manual-2', description: 'Opção 2' },
        { public_id: unique_id(), description: 'Opção 3' },
        { public_id: unique_id(), description: 'Opção 4' },
      ],
      index: 1,
      total: 3,
      startedAt: 0,
    },
  }
}

function goToShowTrueQuestion() {
  session.value = {
    code: 'asdfg',
    quiz: {
      public_id: 'id-quiz',
      title: 'Título do quiz'
    },
    participants: [],
    status: SessionStatus.SHOWING_QUESTION,
    question: {
      public_id: unique_id(),
      description: 'Título da questão',
      time_limit: 60,
      type: QuestionType.TRUE_OR_FALSE,
      options: [
        { public_id: 'id-manual-3', description: 'Verdadeiro' },
        { public_id: 'id-manual-4', description: 'Falso' },
      ],
      index: 2,
      total: 3,
      startedAt: 0,
    },
  }
}

function goToShowTextQuestion() {
  session.value = {
    code: 'asdfg',
    quiz: {
      public_id: 'id-quiz',
      title: 'Título do quiz'
    },
    participants: [],
    status: SessionStatus.SHOWING_QUESTION,
    question: {
      public_id: unique_id(),
      description: 'Título da questão de texto',
      time_limit: 60,
      type: QuestionType.TEXT,
      options: [],
      index: 3,
      total: 3,
      startedAt: 0,
    },
  }
}

function goToShowQuestionFeedback() {
  if (session.value.status !== SessionStatus.SHOWING_QUESTION) return
  session.value = {
    code: 'asdfg',
    quiz: {
      public_id: 'id-quiz',
      title: 'Título do quiz'
    },
    participants: [],
    status: SessionStatus.FEEDBACK_QUESTION,
    question: session.value.question,
    feedback: session.value.question.type === QuestionType.MULTI_CHOICE
      ? { correct_answer: 'id-manual-1', given_answer: 'id-manual-1', is_correct: true, points: 100, velocity_bonus: 10, streak_bonus: 5 } : session.value.question.type === QuestionType.TRUE_OR_FALSE
        ? { correct_answer: 'id-manual-3', given_answer: 'id-manual-4', is_correct: false, points: 0, velocity_bonus: 0, streak_bonus: 0 } : { correct_answer: 'certo', given_answer: 'Certo', is_correct: false, points: 100, velocity_bonus: 10, streak_bonus: 5 }
  }
}

function goToShowSessionFeedback() {
  session.value = {
    code: 'asdfg',
    quiz: {
      public_id: 'id-quiz',
      title: 'Título do quiz'
    },
    participants: [],
    status: SessionStatus.FEEDBACK_SESSION,
    ranking: [
      { name: 'Gabriel', points: 456 },
      { name: 'Lucas', points: 354 },
      { name: 'Aiai', points: 156 },
      { name: 'Vai não para', points: 23 },
      { name: 'Mais um grandão aqui bem grande mesmo o cara é gigante', points: 12 },
      { name: 'asfldkj', points: 2 },
    ]
  }
}

const session_store = useSessionStore()
if (!session_store.code) {
  navigateTo('/session/entry')
}

const socket = useSocket()
socket.emit('participant:join', { code: session_store.code })

const { data, error } = await useApiUseFetch<ParticipantSessionState>(`/session/sync/${session_store.code}`)
if (data.value) {
  session.value = data.value
}

onMounted(() => {
  socket.on('game:participant:update-state', (payload) => {
    session.value = payload
  })
})

onBeforeUnmount(() => {
  socket.removeListener('game:participant:update-state')
})
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-4 pa-md-8 fill-height flex-column">
    <SessionWaitingStart v-if="session.status === SessionStatus.WAITING_START" class="fill-height flex-column"
      :quiz_title="session.quiz.title" />
    <SessionQuestion v-else-if="session.status === SessionStatus.SHOWING_QUESTION" v-bind="session.question" />
    <SessionQuestionFeedback v-else-if="session.status === SessionStatus.FEEDBACK_QUESTION" :question="session.question"
      :feedback="session.feedback" />
    <SessionRanking v-else-if="session.status === SessionStatus.FEEDBACK_SESSION"
      class="flex-fill d-flex flex-column align-center justify-center" :ranking="session.ranking" />
    <div class="position-absolute top-0 w-100 opacity-50">
      <v-btn @click.stop="goToWaiting">Go to waiting</v-btn>
      <v-btn @click.stop="goToShowMultiQuestion">Show question multi</v-btn>
      <v-btn @click.stop="goToShowTrueQuestion">Show question true</v-btn>
      <v-btn @click.stop="goToShowTextQuestion">Show question text</v-btn>
      <v-btn @click.stop="goToShowQuestionFeedback">Show question feedback</v-btn>
      <v-btn @click.stop="goToShowSessionFeedback">Show session feedback</v-btn>
      <v-btn @click.stop="goToShowSessionFeedback">End</v-btn>
    </div>
  </v-container>
</template>
