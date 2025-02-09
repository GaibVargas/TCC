import {
  QuestionType,
  type Question,
  type QuestionOption,
  type Quiz,
} from "~/types/quiz"

export const questionTypeTranslation = {
  [QuestionType.MULTI_CHOICE]: "Múltipla escolha",
  [QuestionType.TEXT]: "Texto",
  [QuestionType.TRUE_OR_FALSE]: "Verdadeiro e falso",
}

export function baseOption(description?: string): QuestionOption {
  return {
    id: unique_id(),
    description: description ?? "",
    is_correct_answer: false,
  }
}

export function baseQuestion(): Question {
  return {
    id: unique_id(),
    type: QuestionType.MULTI_CHOICE,
    description: "",
    time_limit: null,
    correct_text_answer: "",
    options: [],
    multi_choice_options: [
      baseOption(),
      baseOption(),
      baseOption(),
      baseOption(),
    ],
    true_or_false_options: [
      baseOption("Verdadeiro"),
      baseOption("Falso"),
    ],
  }
}

export function baseQuiz(): Quiz {
  return {
    title: "",
    questions: [baseQuestion()],
  }
}
