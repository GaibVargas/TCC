import {
  generateUserAccessToken,
  generateUserRefreshToken,
} from '../../auth/token'
import prisma from '../../config/db'
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
  const dbUser = await prisma.user.create({
    data: {
      name: user.name,
      role: user.role,
      locale: user.locale,
      lms_iss: user.lms.iss,
      lms_platform: user.lms.platform,
      lms_user_id: user.lms.user_id,
      lms_version: user.lms.version,
      lms_client_id: user.lms.client_id,
      lms_outcome_source_id: user.lms.outcome.source_id,
      lms_outcome_service_url: user.lms.outcome.service_url,
    },
  })
  return {
    public_id: dbUser.public_id,
    name: dbUser.name,
    role: getValidatedUserRole(dbUser.role),
  }
}

async function updateUser(user: CreateUserPayload): Promise<MinUser> {
  const dbUser = await prisma.user.update({
    where: {
      lms_iss_lms_user_id: {
        lms_iss: user.lms.iss,
        lms_user_id: user.lms.user_id,
      },
    },
    data: {
      name: user.name,
      role: user.role,
      locale: user.locale,
      lms_platform: user.lms.platform,
      lms_version: user.lms.version,
      lms_client_id: user.lms.client_id,
      lms_outcome_source_id: user.lms.outcome.source_id,
      lms_outcome_service_url: user.lms.outcome.service_url,
    },
  })
  return {
    public_id: dbUser.public_id,
    name: dbUser.name,
    role: getValidatedUserRole(dbUser.role),
  }
}

export async function updateOrCreateUser(
  user: CreateUserPayload,
): Promise<MinUser> {
  const dbUser = await prisma.user.findFirst({
    where: {
      lms_iss: user.lms.iss,
      lms_user_id: user.lms.user_id,
    },
  })
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
  await prisma.user.update({
    where: { public_id: user.public_id },
    data: { auth_refresh_token: refresh_token },
  })
  return {
    access_token,
    refresh_token,
  }
}
