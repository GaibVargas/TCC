export enum QuestionType {
  MULTI_CHOICE = 'multi_choice',
  TRUE_OR_FALSE = 'true_or_false',
  TEXT = 'text',
}

export type QuestionOption = {
  public_id?: string
  id: string // Para fins de renderização
  description: string
  is_correct_answer: boolean
}

export type Question = {
  public_id?: string
  id: string // Para fins de renderização
  type: QuestionType
  description: string
  time_limit: number | null 
  correct_text_answer: string
  options: QuestionOption[]

  multi_choice_options: QuestionOption[]
  true_or_false_options: QuestionOption[]
}

export type Quiz = {
  public_id?: string
  title: string
  questions: Question[]
  createdAt?: Date
}

export type QuizResume = {
  public_id: string
  title: string
  n_questions: number
  can_open_session: boolean
}