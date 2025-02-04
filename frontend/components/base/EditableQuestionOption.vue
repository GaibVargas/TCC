<script lang="ts" setup>
interface Props {
  id?: string | number
  prepend?: string
  placeholder?: string
  questionOption: {
    description: string
    is_right_answer: boolean
  }
}
const props = defineProps<Props>()
const placeholder = props.placeholder || 'Opção'
const prepend = props.prepend || 'a.'
const id = props.id || 'input_id'
</script>

<template>
  <div class="border-sm border-opacity-50 pa-4 rounded d-flex justify-space-between align-center">
    <div class="option-input d-flex align-center w-100">
      <label :for="id" class="mr-2 text-medium-emphasis">{{ prepend }}</label>
      <input type="text" :id="id" :placeholder="placeholder" class="mr-2 w-100 option-input"
        v-model="props.questionOption.description">
    </div>
    <BaseCircledCheckbox v-model="props.questionOption.is_right_answer" />
  </div>
</template>

<style lang="sass" scoped>
.option-input:focus
  outline: none
</style>
