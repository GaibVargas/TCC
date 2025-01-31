import { MinUser } from '../user/type'
import quizModel from './model'
import { CreateQuizPayload } from './type'

export async function createQuiz(user: MinUser, quiz: CreateQuizPayload): Promise<void> {
  await quizModel.createQuiz(user, quiz)
}

const quizServices = {
  createQuiz,
}

export default quizServices
