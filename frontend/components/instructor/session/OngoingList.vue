<script lang="ts" setup>
import type { SessionItem } from '~/types/session'

const { data, status } = await useApiUseFetch<SessionItem[]>('/session/ongoing', {
  lazy: true,
})
</script>

<template>
  <v-alert variant="outlined" v-if="status === 'pending' || status === 'idle'">
    <p>
      <v-progress-circular color="primary" indeterminate size="20" class="mr-4"></v-progress-circular>
      Buscando sessões ativas...
    </p>
  </v-alert>
  <v-alert v-else-if="status === 'error'" color="error">Erro ao buscar suas sessões ativas.</v-alert>
  <v-container v-else-if="data" fluid class="ma-0 pa-0">
    <ul class="flex-fill list mb-8">
      <li v-for="session in data" :key="session.public_id" class="mb-2">
        <InstructorSessionListItem :key="session.public_id" :session="session" :is_active="true"/>
      </li>
    </ul>
  </v-container>
</template>

<style lang="sass" scoped>
.list
  list-style: none
</style>
