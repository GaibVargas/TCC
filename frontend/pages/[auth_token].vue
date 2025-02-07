<script lang="ts" setup>
import { UserRoles, type LoggedUserTokens, type User } from '~/types/user'

const route = useRoute()
const auth_token = route.params.auth_token

const { data, error } = await useApiUseFetch<LoggedUserTokens>('/user/login', { lazy: true, query: { auth_token } })

const errorOnGetUser = ref(false)

watch(data, async (newData) => {
  if (newData) {
    const { setAccessToken, setRefreshToken } = useAuthStore()
    setAccessToken(newData.access_token)
    setRefreshToken(newData.refresh_token)
    try {
      const response = await useApiFetch<User>('/user/me')
      const user = useUser()
      user.setUser(response)
      if (user.role === UserRoles.INSTRUCTOR) navigateTo('/instructor')
      else navigateTo('/')
    } catch (error) {
      errorOnGetUser.value = true
      console.error('Error getting user data', error)
      return
    }
  }
})
</script>

<template>
  <v-container fluid class="ma-0 pa-8 fill-height d-flex justify-center align-center">
    <h1 v-if="error || errorOnGetUser">Erro ao fazer login :(</h1>
    <h1 v-else>Carregando...</h1>
  </v-container>
</template>
