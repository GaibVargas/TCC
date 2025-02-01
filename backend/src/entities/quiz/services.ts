import { MinUser } from '../user/type'
import quizModel from './model'
import { CreateQuizPayload, Quiz, UpdateQuizPayload } from './type'

export async function createQuiz(user: MinUser, quiz: CreateQuizPayload): Promise<Quiz> {
  return await quizModel.createQuiz(user, quiz)
}

export async function getQuiz(public_id: string): Promise<Quiz> {
  return await quizModel.findQuizByPublicId(public_id)
}

export async function updateQuiz(public_id: string, quiz: UpdateQuizPayload): Promise<Quiz> {
  return await quizModel.findQuizByPublicIdAndUpdate(public_id, quiz)
}

const quizServices = {
  createQuiz,
  getQuiz,
  updateQuiz,
}

export default quizServices
