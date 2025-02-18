export default defineNuxtRouteMiddleware((to, from) => {
  const user = useUser()
  if (!user.public_id) {
    return navigateTo('/')
  }
})