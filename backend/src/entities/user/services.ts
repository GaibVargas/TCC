import {
  generateUserAccessToken,
  generateUserRefreshToken,
} from '../../auth/token'
import userModel from './model'
import {
  CreateUserPayload,
  MinUser,
  Roles,
  rolesSchema,
  UserRoles,
} from './type'

export function getValidatedUserRole(role: string): UserRoles {
  return rolesSchema.parse(role)
}

export function getUserRole(roles: string[]): Roles {
  type RoleOption = {
    descriptor: string
    value: Roles
  }
  const rolesOptions: RoleOption[] = [
    {
      descriptor: 'Instructor',
      value: UserRoles.INSTRUCTOR,
    },
    {
      descriptor: 'Learner',
      value: UserRoles.PARTICIPANT,
    },
    {
      descriptor: 'Administrator',
      value: UserRoles.INSTRUCTOR,
    },
    {
      descriptor: 'ContentDeveloper',
      value: UserRoles.INSTRUCTOR,
    },
    {
      descriptor: 'Mentor',
      value: UserRoles.INSTRUCTOR,
    },
    {
      descriptor: 'TeachingAssistant',
      value: UserRoles.INSTRUCTOR,
    },
    {
      descriptor: 'Observer',
      value: UserRoles.PARTICIPANT,
    },
    {
      descriptor: 'InstitutionAdmin',
      value: UserRoles.INSTRUCTOR,
    },
  ]
  const mappedRoles: Roles[] = []
  for (const role of roles) {
    for (const roleOption of rolesOptions) {
      const isIncluded = role
        .toLowerCase()
        .includes(roleOption.descriptor.toLocaleLowerCase())
      if (isIncluded && roleOption.value === UserRoles.INSTRUCTOR)
        return UserRoles.INSTRUCTOR
      if (isIncluded) mappedRoles.push(roleOption.value)
    }
  }
  return UserRoles.PARTICIPANT
}

async function createUser(user: CreateUserPayload): Promise<MinUser> {
  return await userModel.createUser(user)
}

async function updateUser(user: CreateUserPayload): Promise<MinUser> {
  return await userModel.updateUserByLMSId(user)
}

export async function updateOrCreateUser(
  user: CreateUserPayload,
): Promise<MinUser> {
  const dbUser = await userModel.findUserByLMSId(user)
  if (!dbUser) return createUser(user)
  return updateUser(user)
}

export type LoggedUserTokens = {
  access_token: string
  refresh_token: string
}

export async function loginUser(user: MinUser): Promise<LoggedUserTokens> {
  const access_token = generateUserAccessToken(user)
  const refresh_token = generateUserRefreshToken(user)
  await userModel.updateUserRefreshTokenByPublicId(
    user.public_id,
    refresh_token,
  )
  return {
    access_token,
    refresh_token,
  }
}
