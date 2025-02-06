<script lang="ts" setup>
import type { InstructorQuizQuestionList } from '#components'
import { QuestionType, type QuestionOption, type Quiz } from '~/types/quiz'

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

const questionListRef: Ref<InstanceType<typeof InstructorQuizQuestionList> | null> = ref(null)

function addQuestion() {
  quiz.questions.push(baseQuestion())
  nextTick(() => {
    const el = questionListRef?.value?.$el
    if (el instanceof HTMLElement) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
    }
  })
}

function removeQuestion(questionId: string) {
  quiz.questions = quiz.questions.filter(q => q.id !== questionId)
  if (!quiz.questions.length)
    quiz.questions.push(baseQuestion())
  if (currentQuestionIndexOnEdit.value >= quiz.questions.length) currentQuestionIndexOnEdit.value = quiz.questions.length - 1
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
  <v-container fluid class="ma-0 pa-0 fill-height w-100 flex-column">
    <div class="border-b-thin w-100">
      <InstructorQuizHeader v-model="quiz.title" @save="saveQuiz" @cancel="cancelQuiz" />
    </div>
    <v-container fluid class="ma-0 pa-0 flex-fill d-flex align-center justify-center">
      <v-container fluid class="ma-0 pa-0 fill-height d-flex flex-column w-33 border-e-thin">
        <InstructorQuizQuestionList ref="questionListRef" class="w-100 flex-grow-1 overflow-y-auto quiz-list"
          :questions="quiz.questions" :highlighted-question-index="currentQuestionIndexOnEdit"
          @question-select="selectQuestion" @quesion-remove="removeQuestion" />
        <v-container class="ma-0 pa-0 py-4 mt-auto d-flex align-center justify-center">
          <v-btn color="primary" @click.stop="addQuestion">Adicionar pergunta</v-btn>
        </v-container>
      </v-container>
      <InstructorQuizQuestion class="pa-16" v-model="quiz.questions[currentQuestionIndexOnEdit]" />
    </v-container>
  </v-container>
</template>

<style lang="sass" scoped>
.quiz-list
  --quiz-header-height: 100px
  --add-question-btn-height: 68px
  max-height: calc(100vh - (var(--quiz-header-height) + var(--add-question-btn-height)))
</style>
