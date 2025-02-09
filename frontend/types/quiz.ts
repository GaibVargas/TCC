export enum QuestionType {
  MULTI_CHOICE = "multi_choice",
  TRUE_OR_FALSE = "true_or_false",
  TEXT = "text",
}

interface PublicId {
  public_id: string
}

export interface QuestionOption {
  id: string
  description: string
  is_correct_answer: boolean
}
export interface QuestionOptionPayload extends PublicId, QuestionOption {}

export interface QuestionGeneric<OptionT> {
  id: string
  type: QuestionType
  description: string
  time_limit: number | null
  correct_text_answer: string
  options: OptionT[]

  multi_choice_options: OptionT[]
  true_or_false_options: OptionT[]
}
export interface Question extends QuestionGeneric<QuestionOption> {}
export interface QuestionPayload
  extends PublicId,
    Omit<
      QuestionGeneric<QuestionOptionPayload>,
      "multi_choice_options" | "true_or_false_options"
    > {}

export interface QuizGeneric<QuestionT> {
  title: string
  questions: QuestionT[]
}
export interface Quiz extends QuizGeneric<Question> {}
export interface QuizPayload extends PublicId, QuizGeneric<QuestionPayload> {}

export interface QuizResume {
  public_id: string
  title: string
  n_questions: number
  can_open_session: boolean
}
