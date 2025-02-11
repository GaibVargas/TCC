<script lang="ts" setup>
import type { Paginated } from '~/types/pagination'
import type { QuizResume } from '~/types/quiz'

const page_size = 10
const page = ref(1)
const total_items = computed(() => {
  if (!data.value?.count) return 0
  return data.value.count
})
const n_pages = computed(() => Math.ceil(total_items.value / page_size))

const { data, status, refresh } = await useApiUseFetch<Paginated<QuizResume[]>>('/quiz', { 
  lazy: true,
  query: {
    page,
    page_size,
  }
})

const is_pagination_loading = ref(false)

const computed_status = computed(() => {
  if (is_pagination_loading.value) return 'loading-page'
  return status.value
})

watch(page, async (_) => {
  is_pagination_loading.value = true
  await refresh()
  is_pagination_loading.value = false
})
</script>

<template>
  <v-alert variant="outlined" v-if="computed_status === 'pending' || computed_status === 'idle'">
    <p>
      <v-progress-circular color="primary" indeterminate size="20" class="mr-4"></v-progress-circular>
      Buscando quizzes...
    </p>
  </v-alert>
  <v-alert v-else-if="computed_status === 'error'" color="error">Erro ao buscar seus quizzes.</v-alert>
  <v-alert v-else-if="computed_status === 'success' && !data?.items?.length">Você não possui quizzes criados.</v-alert>
  <v-container v-else-if="data"  fluid class="ma-0 pa-0">
    <ul class="flex-fill list">
      <li v-for="quizz in data.items" :key="quizz.public_id" class="mb-2">
        <InstructorQuizListItem :quiz="quizz" :key="quizz.public_id" @remove="refresh" />
      </li>
    </ul>
    <div class="d-flex align-center justify-center">
      <v-pagination v-model="page" :length="n_pages" :disabled="is_pagination_loading" density="compact" total-visible="4"></v-pagination>
      <v-progress-circular v-show="is_pagination_loading" color="primary" indeterminate size="20" class="ml-4"></v-progress-circular>
    </div>
  </v-container>
</template>

<style lang="sass" scoped>
.list
  list-style: none
</style>
