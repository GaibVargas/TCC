<script lang="ts" setup>
import type { QuestionOption } from '~/types/quiz'

interface Props {
  id?: string
  prepend?: string
  placeholder?: string
}
const props = defineProps<Props>()
const placeholder = props.placeholder || 'Opção'
const prepend = props.prepend || 'a.'
const id = props.id || 'input_id'

const modelValue = defineModel<QuestionOption>({ required: true })
const emit = defineEmits<{
  (e: 'update:modelValue', option: QuestionOption): void
}>()
</script>

<template>
  <div class="border-sm border-opacity-50 pa-4 rounded d-flex justify-space-between align-center">
    <div class="option-input d-flex align-center w-100">
      <label :for="id" class="mr-2 text-medium-emphasis">{{ prepend }}</label>
      <input type="text" :id="id" :placeholder="placeholder" class="mr-2 w-100 option-input"
        :value="modelValue.description"
        @input="event => emit('update:modelValue', { ...modelValue, description: (event.target as HTMLInputElement).value })">
    </div>
    <BaseCircledCheckbox :model-value="modelValue.is_correct_answer"
      @update:model-value="v => emit('update:modelValue', { ...modelValue, is_correct_answer: v })" />
  </div>
</template>

<style lang="sass" scoped>
.option-input:focus
  outline: none
</style>
