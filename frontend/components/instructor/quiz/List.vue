<script lang="ts" setup>
import type { Paginated } from '~/types/pagination';
import type { QuizResume } from '~/types/quiz'

const { data, status, refresh } = await useApiUseFetch<Paginated<QuizResume[]>>('/quiz', { lazy: true })
</script>

<template>
  <v-alert variant="outlined" v-if="status === 'pending' || status === 'idle'">
    <p>
      <v-progress-circular color="primary" indeterminate size="20" class="mr-4"></v-progress-circular>
      Buscando quizzes...
    </p>
  </v-alert>
  <v-alert v-else-if="status === 'error'" color="error">Erro ao buscar seus quizzes.</v-alert>
  <v-alert v-else-if="status === 'success' && !data?.items.length">Você não possui quizzes criados.</v-alert>
  <ul v-else-if="data" class="flex-fill list">
    <li v-for="quizz in data.items" :key="quizz.public_id" class="mb-2">
      <InstructorQuizListItem :quiz="quizz" :key="quizz.public_id" @remove="refresh" />
    </li>
  </ul>
</template>

<style lang="sass" scoped>
.list
  list-style: none
</style>
