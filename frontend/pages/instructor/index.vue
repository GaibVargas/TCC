<script lang="ts" setup>
import type { Paginated } from '~/types/pagination';
import type { QuizResume } from '~/types/quiz';

definePageMeta({
  middleware: 'is-instructor'
})

const { data, status } = await useApiUseFetch<Paginated<QuizResume[]>>('/quiz', { lazy: true })
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-2 pa-md-8">
    <v-row class="ma-0 mb-4" align="center">
      <h2 class="mr-4">Quizzes</h2>
      <v-btn color="primary">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-alert variant="outlined" v-if="status === 'pending' || status === 'idle'">
        <p>
          <v-progress-circular color="primary" indeterminate size="20" class="mr-4"></v-progress-circular>
          Buscando quizzes...
        </p>
      </v-alert>
      <v-alert v-else-if="status === 'error'" color="error">Erro ao buscar seus quizzes.</v-alert>
      <v-alert v-else-if="status === 'success' && !data?.items.length">Você não possui quizzes criados.</v-alert>
      <InstructorQuizList v-else-if="data" :quizzes="data.items" />
    </v-row>
  </v-container>
</template>
