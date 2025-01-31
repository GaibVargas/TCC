/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import prisma from '../../config/db'
import userModel from '../user/model'
import { MinUser } from '../user/type'
import { CreateQuizPayload, Quiz, quiz_schema } from './type'

export async function createQuiz(user: MinUser, quiz: CreateQuizPayload): Promise<Quiz> {
  const author_id = await userModel.getUserIdByPublicId(user.public_id)
  const quizDb = await prisma.quiz.create({
    data: {
      title: quiz.title,
      author: { connect: { id: author_id } },
      questions: {
        create: quiz.questions.map((question) => ({
          type: question.type,
          description: question.description,
          time_limit: question.time_limit ?? null,
          correct_text_answer: question.correct_text_answer,
          options: {
            create: question.options.map((option) => ({
              description: option.description,
              is_correct_answer: option.is_correct_answer,
            })),
          },
        })),
      },
    },
    include: {
      questions: {
        omit: { id: true },
        include: {
          options: {
            omit: { id: true }
          }
        }
      }
    },
    omit: { id: true }
  })
  return quiz_schema.parse(quizDb)
}

const quizModel = {
  createQuiz,
}

export default quizModel
