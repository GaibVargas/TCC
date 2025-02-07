import { FastifyReply, FastifyRequest } from 'fastify'
import userServices, { LoggedUserTokens } from './services'

interface AuthQueryParams {
  auth_token: string
}

export async function loginUser(
  req: FastifyRequest<{ Querystring: AuthQueryParams }>,
  _reply: FastifyReply,
): Promise<LoggedUserTokens> {
  return await userServices.loginUser(req.query.auth_token)
}

const userControllers = {
  loginUser,
}

export default userControllers
