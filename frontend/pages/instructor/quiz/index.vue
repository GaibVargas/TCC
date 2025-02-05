<script lang="ts" setup>
import { QuestionType, type Question, type QuestionOption, type Quiz } from '~/types/quiz'

function baseQuestion(): Question {
  return {
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
  }
}

function baseQuiz(): Quiz {
  return {
    title: '',
    questions: [baseQuestion()]
  }
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

function selectQuestion(questionIndex: number) {
  currentQuestionIndexOnEdit.value = questionIndex
}

function removeQuestion(questionId: string) {
  quiz.questions = quiz.questions.filter(q => q.id !== questionId)
  if (!quiz.questions.length)
    quiz.questions.push(baseQuestion())
}

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
  <v-container fluid class="ma-0 pa-0 fill-height w-100 flex-column ">
    <div class="border-b-thin w-100">
      <InstructorQuizHeader v-model="quiz.title" @save="saveQuiz" @cancel="cancelQuiz" />
    </div>
    <v-container fluid class="ma-0 pa-0 flex-fill d-flex align-center justify-center">
      <v-container class="ma-0 pa-0 fill-height w-33 border-e-thin">
        <InstructorQuizQuestionList :questions="quiz.questions" :highlighted-question-index="currentQuestionIndexOnEdit"
          @question-select="selectQuestion" @quesion-remove="removeQuestion" />
      </v-container>
      <InstructorQuizQuestion class="pa-16" v-model="quiz.questions[currentQuestionIndexOnEdit]" />
    </v-container>
  </v-container>
</template>

<style lang="scss" scoped></style>
