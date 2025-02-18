<script lang="ts" setup>
const props = defineProps<{
  prepend: string
  description: string
  disabled?: boolean
  correct?: boolean
  incorrect?: boolean
}>()

const disabled = props.disabled ?? false
const correct = props.correct ?? false
const incorrect = props.incorrect ?? false

function click() {
  console.log("clik clika")
}
</script>

<template>
  <button class="text-start px-4 py-4 rounded border-thin border-opacity-100 btn" :class="{ correct, incorrect }" :disabled="disabled" @click="click">
    <span class="opacity-50">{{ prepend }}</span>
    {{ props.description }}
  </button>
</template>

<style lang="sass" scoped>
.btn
  &:hover
    background: #00000011
.correct
  border-color: #23FFAB !important
  background-color: #E0FFF3 !important
.incorrect
  border-color: #FF4123 !important
  background-color: #FFE4E0 !important
</style>

