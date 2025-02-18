<script lang="ts" setup>
const props = defineProps<{
  prepend: string
  description: string
  disabled?: boolean
  selected?: boolean
  correct?: boolean
  incorrect?: boolean
}>()

const disabled = computed(() => props.disabled ?? false)
const selected = computed(() => props.selected ?? false)
const correct = computed(() => props.correct ?? false)
const incorrect = computed(() => props.incorrect ?? false)

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <button class="text-start px-4 py-4 rounded border-thin border-opacity-100 btn" :class="{ correct, incorrect, selected }" :disabled="disabled" @click="emit('click')">
    <span class="opacity-50">{{ prepend }}</span>
    {{ props.description }}
  </button>
</template>

<style lang="sass" scoped>
.btn
  &:not(:disabled):hover
    background: #00000011
.selected
  background: #00000011
.correct
  border-color: rgb(var(--v-theme-success)) !important
  background-color: rgba(var(--v-theme-success), .1) !important
.incorrect
  border-color: rgb(var(--v-theme-error)) !important
  background-color: rgba(var(--v-theme-error), .1) !important
</style>

