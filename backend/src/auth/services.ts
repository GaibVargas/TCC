import { config } from '../config/env'
import { LoggedUserTokens } from '../entities/user/services'
import { generateUserAccessToken, verifyToken } from './token'
import HttpRequestError from '../utils/error'
import { MinUser } from '../entities/user/type'
import prisma from '../config/db'

export async function refreshAccessToken(
  refresh_token: string,
): Promise<LoggedUserTokens> {
  const token = verifyToken(refresh_token, config.auth.REFRESH_TOKEN_SECRET)
  if (!token.valid) {
    throw new HttpRequestError({
      status_code: 401,
      message: token.error,
    })
  }
  const user = token.decoded as MinUser
  const dbUser = await prisma.user.findUnique({
    where: {
      public_id: user.public_id,
    },
    select: {
      public_id: true,
      name: true,
      role: true,
    },
  })
  if (!dbUser)
    throw new HttpRequestError({
      status_code: 400,
      message: 'User not found',
    })
  return {
    refresh_token,
    access_token: generateUserAccessToken(dbUser as MinUser),
  }
}

const authService = {
  refreshAccessToken,
}

export default authService
