export type LoggedUserTokens = {
  access_token: string
  refresh_token: string
}

export enum UserRoles {
  INSTRUCTOR = 'instructor',
  PARTICIPANT = 'participant',
}

export type User = {
  public_id: string
  name: string
  role: UserRoles
}