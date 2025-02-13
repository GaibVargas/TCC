export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  if (!user) {
    return navigateTo('/')
  }
})