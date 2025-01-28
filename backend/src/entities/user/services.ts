import prisma from '../../config/db'
import { Roles, User, UserRoles } from './type'

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

export async function createUser(user: User): Promise<void> {
  await prisma.user.create({
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
      auth_refresh_token: 'aaaa'
    }
  })
}
