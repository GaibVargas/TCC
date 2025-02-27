<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import { SessionStatus, type InstructorSessionState } from '~/types/session'

const base_session: InstructorSessionState = {
  code: 'asdfg',
  quiz: {
    public_id: 'id-quiz',
    title: 'Título do quiz'
  },
  participants: ['1', '2', '3', '4', '5'],
  status: SessionStatus.SHOWING_QUESTION,
  question: {
    public_id: unique_id(),
    description: 'Título da questão',
    time_limit: 60,
    type: QuestionType.MULTI_CHOICE,
    options: [
      { public_id: 'id-manual-1', description: 'Opção 1 ' },
      { public_id: 'id-manual-2', description: 'Opção 2' },
      { public_id: 'id-manual-3', description: 'Opção 3' },
      { public_id: 'id-manual-4', description: 'Opção 4' },
    ],
    index: 1,
    total: 3,
    startedAt: 0,
  },
  ready_participants: ['1', '2']
}

const true_or_false_question: InstructorSessionState = {
  code: 'asdfg',
  quiz: {
    public_id: 'id-quiz',
    title: 'Título do quiz'
  },
  participants: ['1', '2', '3', '4', '5'],
  status: SessionStatus.SHOWING_QUESTION,
  question: {
    public_id: unique_id(),
    description: 'Título da questão',
    time_limit: null,
    type: QuestionType.TRUE_OR_FALSE,
    options: [
      { public_id: 'id-manual-5', description: 'Verdadeiro' },
      { public_id: 'id-manual-6', description: 'Falso' },
    ],
    index: 2,
    total: 3,
    startedAt: 0,
  },
  ready_participants: ['1', '2']
}

const text_question: InstructorSessionState = {
  code: 'asdfg',
  quiz: {
    public_id: 'id-quiz',
    title: 'Título do quiz'
  },
  participants: ['1', '2', '3', '4', '5'],
  status: SessionStatus.SHOWING_QUESTION,
  question: {
    public_id: unique_id(),
    description: 'Título da questão',
    time_limit: null,
    type: QuestionType.TEXT,
    options: [],
    index: 3,
    total: 3,
    startedAt: 0,
  },
  ready_participants: ['1', '2']
}

const multi_question_feedback: InstructorSessionState = {
  ...base_session,
  status: SessionStatus.FEEDBACK_QUESTION,
  feedback: {
    correct_answer: 'id-manual-3',
    answers: {
      'id-manual-1': ['1', '2', '3'],
      'id-manual-2': ['4', '5'],
    }
  }
}

const true_question_feedback: InstructorSessionState = {
  ...true_or_false_question,
  status: SessionStatus.FEEDBACK_QUESTION,
  feedback: {
    correct_answer: 'id-manual-5',
    answers: {
      'id-manual-5': ['1', '2', '3', '4', '5'],
      'id-manual-6': [],
    }
  }
}

const text_question_feedback: InstructorSessionState = {
  ...text_question,
  status: SessionStatus.FEEDBACK_QUESTION,
  feedback: {
    correct_answer: 'correto',
    answers: {
      'qualquer coisa': ['1', '2'],
      'outra qualquer coisa': ['3'],
      'correto': ['4', '5'],
    }
  }
}

const ranking: InstructorSessionState = {
  code: 'asdfg',
  quiz: {
    public_id: 'id-quiz',
    title: 'Título do quiz'
  },
  participants: ['1', '2', '3', '4', '5'],
  status: SessionStatus.FEEDBACK_SESSION,
  ranking: [
    { name: 'Gabriel', points: 456 },
    { name: 'Lucas', points: 354 },
    { name: 'Aiai', points: 156 },
    { name: 'Vai não para', points: 23 },
    { name: 'Mais um grandão aqui bem grande mesmo o cara é gigante', points: 12 },
    { name: 'asfldkj', points: 2 },
  ],
}

const session = ref<InstructorSessionState>(base_session)

function nextState() {
  if (session.value.status === SessionStatus.SHOWING_QUESTION) {
    if (session.value.question.type === QuestionType.MULTI_CHOICE) return (session.value = multi_question_feedback)
    if (session.value.question.type === QuestionType.TRUE_OR_FALSE) return (session.value = true_question_feedback)
    if (session.value.question.type === QuestionType.TEXT) return (session.value = text_question_feedback)
  }
  if (session.value.status === SessionStatus.FEEDBACK_QUESTION) {
    if (session.value.question.type === QuestionType.MULTI_CHOICE) return (session.value = true_or_false_question)
    if (session.value.question.type === QuestionType.TRUE_OR_FALSE) return (session.value = text_question)
    if (session.value.question.type === QuestionType.TEXT) return (session.value = ranking)
  }
  session.value = base_session
}

function cancel() {
  session.value = base_session
}
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-4 pa-md-8 fill-height flex-column">
    <InstructorSessionQuestion v-if="session.status === SessionStatus.SHOWING_QUESTION" v-bind="session" />
    <InstructorSessionQuestionFeedback v-else-if="session.status === SessionStatus.FEEDBACK_QUESTION" v-bind="session" />
    <SessionRanking v-else-if="session.status === SessionStatus.FEEDBACK_SESSION"
      class="flex-fill d-flex flex-column align-center justify-center" :ranking="session.ranking" />
  </v-container>
  <div class="border-t-thin py-2 w-100 d-flex ga-8 align-center justify-center">
    <v-btn variant="outlined" @click="cancel">Cancelar</v-btn>
    <v-btn color="primary" @click="nextState">Avançar</v-btn>
  </div>
</template>
