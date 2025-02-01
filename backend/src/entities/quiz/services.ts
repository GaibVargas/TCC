import HttpRequestError from '../../utils/error'
import userModel from '../user/model'
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

export async function userIsAuthorOfQuizOrThrow(user_public_id: string, quiz_public_id: string): Promise<void> {
  const author_public_id = await quizModel.getQuizAuthorPublicId(quiz_public_id)
  if (author_public_id !== user_public_id) {
    throw new HttpRequestError({
      status_code: 401,
      message: 'Unauthorized'
    })
  }
}

export async function deleteQuiz(public_id: string): Promise<void> {
  await quizModel.deleteQuizByPublicId(public_id)
}

export async function getQuizzesByAuthor(user_public_id: string): Promise<Quiz[]> {
  const user_id = await userModel.getUserIdByPublicId(user_public_id)
  return await quizModel.findQuizByAuthorId(user_id)
}

const quizServices = {
  createQuiz,
  getQuiz,
  updateQuiz,
  userIsAuthorOfQuizOrThrow,
  deleteQuiz,
  getQuizzesByAuthor,
}

export default quizServices
