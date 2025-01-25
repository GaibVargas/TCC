import { Roles, UserRoles } from './type'

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
