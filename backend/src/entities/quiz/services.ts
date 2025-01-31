import { MinUser } from '../user/type'
import quizModel from './model'
import { CreateQuizPayload, Quiz } from './type'

export async function createQuiz(user: MinUser, quiz: CreateQuizPayload): Promise<Quiz> {
  return await quizModel.createQuiz(user, quiz)
}

const quizServices = {
  createQuiz,
}

export default quizServices
