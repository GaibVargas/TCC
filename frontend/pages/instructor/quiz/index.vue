<script lang="ts" setup>
import { alphabet } from '~/utils/alphabet'

const options = reactive([
  {
    description: '',
    is_right_answer: false,
  },
  {
    description: '',
    is_right_answer: false,
  },
  {
    description: '',
    is_right_answer: false,
  },
  {
    description: '',
    is_right_answer: false,
  },
])
</script>

<template>
  <v-container>
    <div class="py-2 border-b-thin">
      <InstructorQuizHeader />
    </div>
    <BaseEditableQuestionOption v-for="(_, index) in options" :key="index" :id="index" :prepend="`${alphabet[index]}.`"
      v-model:question-option="options[index]" />
  </v-container>
</template>

<style lang="scss" scoped></style>
