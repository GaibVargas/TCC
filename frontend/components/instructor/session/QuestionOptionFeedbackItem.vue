<script lang="ts" setup>
const props = defineProps<{
  prepend: string
  description: string
  n_answers: number
  total: number
  is_correct?: boolean
}>()

const rectangle_height = computed(() => props.total > 0 ? Math.max((props.n_answers / props.total) * 100, 1) : 1)
</script>

<template>
  <div class="d-flex flex-column align-center justify-end fill-height" :style="{ width: '20vw', maxWidth: '20vw' }">
    <span class="text-body-1 text-truncate" :class="{ 'font-weight-bold': is_correct }">
      <v-icon v-if="is_correct" color="success">mdi-check</v-icon>
      {{ n_answers }}
    </span>
    <div class="rounded w-100" :class="[is_correct ? 'bg-success' : 'bg-grey']"
      :style="{ height: `${rectangle_height}%` }"></div>
    <span class="text-body-1 text-truncate" :class="{ 'font-weight-bold': is_correct }" :style="{ maxWidth: '20vw' }">{{ prepend }} {{ description }}</span>
  </div>
</template>
