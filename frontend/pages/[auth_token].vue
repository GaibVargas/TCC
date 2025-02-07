<script lang="ts" setup>
import type { LoggedUserTokens } from '~/types/user'

const route = useRoute()
const auth_token = route.params.auth_token

const { data, error } = await useApiRequest<LoggedUserTokens>('/user/login', { lazy: true, query: { auth_token } })

watch(data, (newData) => {
  if (newData) {
    const { setAccessToken, setRefreshToken } = useAuthStore()
    setAccessToken(newData.access_token)
    setRefreshToken(newData.refresh_token)
  }
})

watch(error, (newError) => {
  if (newError) {
    console.error('Error on user login', newError)
  }
})
</script>

<template>
  <v-container fluid class="ma-0 pa-8 fill-height d-flex justify-center align-center">
    <h1 v-if="error">Erro ao fazer login :(</h1>
    <h1 v-else>Carregando...</h1>
  </v-container>
</template>
