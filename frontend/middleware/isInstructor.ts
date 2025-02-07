import { UserRoles } from "~/types/user"

export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  if (user.role !== UserRoles.INSTRUCTOR) {
    return navigateTo('/')
  }
})