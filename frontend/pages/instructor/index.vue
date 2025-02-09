<script lang="ts" setup>
import type { Paginated } from '~/types/pagination';
import type { QuizResume } from '~/types/quiz';

definePageMeta({
  middleware: 'is-instructor'
})

const { data, status } = await useApiUseFetch<Paginated<QuizResume[]>>('/quiz', { lazy: true })
</script>

<template>
  <v-container class="ma-0 pa-sm-2 pa-md-8">
    <v-row class="ma-0" align="center">
      <h2 class="mr-4">Quizzes</h2>
      <v-btn color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row class="ma-0 pa-0">
      <p v-if="status === 'pending' || status === 'idle'">Carregando...</p>
      <p v-else-if="status === 'error'">Erro ao buscar seus quizzes</p>
      <p v-else-if="status === 'success' && !data?.items.length">Você não possui quizzes criados</p>
      <code v-else>{{ data }}</code>
    </v-row>
  </v-container>
</template>
