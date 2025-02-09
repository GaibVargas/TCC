<script lang="ts" setup>
import type { QuizResume } from '~/types/quiz'

interface Props {
  quiz: QuizResume
}
const props = defineProps<Props>()
</script>

<template>
  <div class="pa-4 border-thin cursor-pointer">
    <p class="text-body-1">{{ quiz.title }}</p>

  </div>
</template>
