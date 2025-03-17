import { Paginated, PaginationQuery } from '../../common/pagination'
import { MinUser } from '../user/type'
import sessionModel from './model'
import { SessionItem } from './type'

export async function getFinishedSessionsByAuthor(
  user: MinUser,
  query: PaginationQuery,
): Promise<Paginated<SessionItem[]>> {
  return await sessionModel.findFinishedSessionsByAuthorId(user.id, query)
}

export async function getOngoingSessionsByAuthor(
  user: MinUser,
): Promise<SessionItem[]> {
  return await sessionModel.findOngoingSessionsByAuthorId(user.id)
}

const sessionServices = {
  getFinishedSessionsByAuthor,
  getOngoingSessionsByAuthor,
}

export default sessionServices
