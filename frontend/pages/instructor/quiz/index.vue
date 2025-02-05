<script lang="ts" setup>
import { QuestionType, type QuestionOption, type Quiz } from '~/types/quiz'

const quizBase: Quiz = {
  title: '',
  questions: [
    {
      id: unique_id(),
      type: QuestionType.MULTI_CHOICE,
      description: '',
      time_limit: null,
      correct_text_answer: '',
      options: [],
      multi_choice_options: [
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
      ],
      true_or_false_options: [
        {
          id: unique_id(),
          description: 'Verdadeiro',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: 'Falso',
          is_correct_answer: false,
        },
      ]
    },
  ]
}

const quiz: Quiz = reactive({
  title: '',
  questions: [
    {
      id: unique_id(),
      type: QuestionType.MULTI_CHOICE,
      description: 'Multi',
      time_limit: null,
      correct_text_answer: '',
      options: [],
      multi_choice_options: [
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
      ],
      true_or_false_options: [
        {
          id: unique_id(),
          description: 'Verdadeiro',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: 'Falso',
          is_correct_answer: false,
        },
      ]
    },
    {
      id: unique_id(),
      type: QuestionType.TRUE_OR_FALSE,
      description: 'True False',
      time_limit: 180,
      correct_text_answer: '',
      options: [],
      multi_choice_options: [
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
      ],
      true_or_false_options: [
        {
          id: unique_id(),
          description: 'Verdadeiro',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: 'Falso',
          is_correct_answer: false,
        },
      ]
    },
    {
      type: QuestionType.TEXT,
      id: unique_id(),
      description: 'Text',
      time_limit: null,
      correct_text_answer: '',
      options: [],
      multi_choice_options: [
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: '',
          is_correct_answer: false,
        },
      ],
      true_or_false_options: [
        {
          id: unique_id(),
          description: 'Verdadeiro',
          is_correct_answer: false,
        },
        {
          id: unique_id(),
          description: 'Falso',
          is_correct_answer: false,
        },
      ]
    },
  ],
})
const currentQuestionIndexOnEdit = ref(0)

function formatQuiz(quiz: Quiz): Quiz {
  return {
    ...quiz,
    questions: quiz.questions.map(q => {
      let options: QuestionOption[] = []
      if (q.type === QuestionType.MULTI_CHOICE)
        options = q.multi_choice_options
      else if (q.type === QuestionType.TRUE_OR_FALSE)
        options = q.true_or_false_options
      return {
        ...q,
        options,
        correct_text_answer: q.type === QuestionType.TEXT ? q.correct_text_answer : '',
      }
    })
  }
}

function saveQuiz() {
  const formattedQuiz = formatQuiz(quiz)
  console.log(formattedQuiz)
}

function cancelQuiz() {
  console.log('cancel')
}
</script>

<template>
  <v-container class="flex-column fill-height">
    <div class="py-2 border-b-thin w-100">
      <InstructorQuizHeader v-model="quiz.title" @save="saveQuiz" @cancel="cancelQuiz" />
    </div>
    <v-container class="ma-0 pa-0 flex-fill d-flex align-center justify-center">
      <InstructorQuizQuestion v-model="quiz.questions[currentQuestionIndexOnEdit]" />
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped></style>
