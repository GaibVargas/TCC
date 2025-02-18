<script lang="ts" setup>
import { QuestionType } from '~/types/quiz';
import { SessionStatus, type SessionState } from '~/types/session'

const session = ref<SessionState>({
  quiz_title: 'Título do quiz',
  status: SessionStatus.WAITING_START,
})

function goToWaiting() {
  session.value = {
    quiz_title: 'Título do quiz',
    status: SessionStatus.WAITING_START,
  }
}

function goToShowMultiQuestion() {
  session.value = {
    quiz_title: session.value.quiz_title,
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
      question_index: 1,
      total_questions: 3,
      startedAt: 0,
    },
  }
}

function goToShowTrueQuestion() {
  session.value = {
    quiz_title: session.value.quiz_title,
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
      question_index: 2,
      total_questions: 3,
      startedAt: 0,
    },
  }
}

function goToShowTextQuestion() {
  session.value = {
    quiz_title: session.value.quiz_title,
    status: SessionStatus.SHOWING_QUESTION,
    question: {
      public_id: unique_id(),
      description: 'Título da questão de texto',
      time_limit: 60,
      type: QuestionType.TEXT,
      options: [],
      question_index: 3,
      total_questions: 3,
      startedAt: 0,
    },
  }
}

function goToShowQuestionFeedback() {
  if (session.value.status !== SessionStatus.SHOWING_QUESTION) return
  session.value = {
    quiz_title: session.value.quiz_title,
    status: SessionStatus.FEEDBACK_QUESTION,
    question: session.value.question,
    feedback: session.value.question.type === QuestionType.MULTI_CHOICE
      ? { correct_answer: 'id-manual-1', given_answer: 'id-manual-1', points: 100, velocity_bonus: 10, streak_bonus: 5 } : session.value.question.type === QuestionType.TRUE_OR_FALSE
        ? { correct_answer: 'id-manual-3', given_answer: 'id-manual-4', points: 0, velocity_bonus: 0, streak_bonus: 0 } : { correct_answer: 'certo', given_answer: 'certo', points: 100, velocity_bonus: 10, streak_bonus: 5 }
  }
}

function goToShowSessionFeedback() {
  session.value = {
    quiz_title: session.value.quiz_title,
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
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-4 pa-md-8 fill-height flex-column container">
    <SessionWaitingStart v-if="session.status === SessionStatus.WAITING_START" class="fill-height flex-column"
      :quiz_title="session.quiz_title" />
    <SessionQuestion v-else-if="session.status === SessionStatus.SHOWING_QUESTION" v-bind="session.question" />
    <SessionQuestionFeedback v-else-if="session.status === SessionStatus.FEEDBACK_QUESTION" :question="session.question"
      :feedback="session.feedback" />
    <SessionRanking v-else-if="session.status === SessionStatus.FEEDBACK_SESSION"
      class="flex-fill d-flex flex-column align-center justify-center" :ranking="session.ranking" />
    <div class="actions">
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

<style lang="sass" scoped>
.container
  position: relative
.actions
  position: absolute
  width: 100%
  top: 0px
  opacity: .5
</style>
