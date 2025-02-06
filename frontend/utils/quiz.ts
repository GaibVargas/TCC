import { QuestionType, type Question, type Quiz } from '~/types/quiz'

export const questionTypeTranslation = {
  [QuestionType.MULTI_CHOICE]: 'Múltipla escolha',
  [QuestionType.TEXT]: 'Texto',
  [QuestionType.TRUE_OR_FALSE]: 'Verdadeiro e falso',
}

export function baseQuestion(): Question {
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

export function baseQuiz(): Quiz {
  return {
    title: '',
    questions: [baseQuestion()]
  }
}
