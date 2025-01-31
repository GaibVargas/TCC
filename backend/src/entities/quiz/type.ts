import { z } from 'zod'

export const create_question_option_schema = z.object({
  description: z.string(),
  is_correct_answer: z.boolean().default(false),
})

export enum QuestionType {
  MULTI_CHOICE = 'multi_choice',
  TRUE_OR_FALSE = 'true_or_false',
  TEXT = 'text',
}
export const question_type_schema = z.nativeEnum(QuestionType)
export const create_question_schema = z.object({
  type: question_type_schema,
  description: z.string(),
  time_limit: z.number().int().optional(),
  correct_text_answer: z.string().default(""),
  options: z.array(create_question_option_schema)
})

export const create_quiz_schema = z.object({
  title: z.string(),
  questions: z.array(create_question_schema),
})
export type CreateQuizPayload = z.infer<typeof create_quiz_schema>

export const question_option = z.object({})
