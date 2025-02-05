<script lang="ts" setup>
import { QuestionType, type Question } from '~/types/quiz'

const modelValue = defineModel<Question>({ required: true })

const emit = defineEmits<{
  (e: 'update:modelValue', question: Question): void
}>()

const questionOptions = [
  { title: 'Múltipla escolha', value: QuestionType.MULTI_CHOICE },
  { title: 'Verdadeiro ou falso', value: QuestionType.TRUE_OR_FALSE },
  { title: 'Texto', value: QuestionType.TEXT }
]

const timeOptions = [
  { title: '30s', value: 30 },
  { title: '1m', value: 60 },
  { title: '2m', value: 120 },
  { title: '3m', value: 180 },
  { title: '4m', value: 240 },
  { title: 'Sem restrição', value: null },
]
</script>

<template>
  <v-container class="ma-0 pa-0">
    <v-row class="ma-0 pa-0 mb-14">
      <v-col class="ma-0 pa-0 mr-4">
        <v-select label="Tipo de pergunta" variant="outlined" :hide-details="true" :items="questionOptions"
          :model-value="modelValue.type"
          @update:model-value="v => emit('update:modelValue', { ...modelValue, type: v })"></v-select>
      </v-col>
      <v-col class="ma-0 pa-0">
        <v-select label="Tempo de pergunta" variant="outlined" :hide-details="true" :items="timeOptions"
          :model-value="modelValue.time_limit"
          @update:model-value="v => emit('update:modelValue', { ...modelValue, time_limit: v })"></v-select>
      </v-col>
    </v-row>
    <v-row class="ma-0 pa-0 mb-14">
      <v-textarea label="Texto da pergunta" variant="outlined" rows="3" no-resize :hide-details="true"
        :model-value="modelValue.description"
        @update:model-value="v => emit('update:modelValue', { ...modelValue, description: v })"></v-textarea>
    </v-row>
    <v-row class="ma-0 pa-0">
      <v-text-field v-if="modelValue.type === QuestionType.TEXT" label="Resposta correta" variant="outlined"
        :model-value="modelValue.correct_text_answer"
        @update:model-value="v => emit('update:modelValue', { ...modelValue, correct_text_answer: v })"></v-text-field>
      <v-col cols="6" class="ma-0 pa-0" :class="[index % 2 === 0 ? 'pr-2' : 'pl-2']" v-else-if="modelValue.type === QuestionType.TRUE_OR_FALSE"
        v-for="(option, index) in modelValue.true_or_false_options">
        <BaseEditableQuestionOption v-model="modelValue.true_or_false_options[index]" :key="option.id" :id="option.id" :prepend="`${alphabet[index]}.`" />
      </v-col>
      <v-col cols="6" class="ma-0 pa-0" :class="[index % 2 === 0 ? 'pr-2' : 'pl-2', { 'mb-4': index <= 1 }]" v-else-if="modelValue.type === QuestionType.MULTI_CHOICE"
        v-for="(option, index) in modelValue.multi_choice_options">
        <BaseEditableQuestionOption v-model="modelValue.multi_choice_options[index]" :key="option.id" :id="option.id" :prepend="`${alphabet[index]}.`" />
      </v-col>
    </v-row>
  </v-container>
</template>
