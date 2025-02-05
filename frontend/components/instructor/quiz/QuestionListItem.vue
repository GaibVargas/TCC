<script lang="ts" setup>
import type { Question } from '~/types/quiz'

interface Props {
  question: Question
  highlight?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'questionRemove', questionId: string): void
}>()
</script>

<template>
  <v-container class="ma-0 px-2 py-4 cursor-pointer" :class="{ 'bg-grey-lighten-2': props.highlight }">
    <v-row class="ma-0 pa-0">
      <v-col cols="2" align="center" class="ma-0 pa-0 d-flex align-center justify-center">
        <v-btn density="compact" size="small" flat icon="mdi-delete" class="bg-transparent" @click.stop="emit('questionRemove', question.id)"></v-btn>
      </v-col>
      <v-col class="ma-0 pa-0 mx-2">
        <p class="d-block text-truncate text-body-1" style="max-width: 170px;">{{ props.question.description ? props.question.description : 'Texto da pergunta' }}</p>
        <p class="d-block text-truncate text-caption text-lowercase" style="max-width: 170px;">{{ questionTypeTranslation[props.question.type] }}</p>
      </v-col>
      <v-col cols="2" class="ma-0 pa-0 align-self-end">
        <p class="text-caption">{{ props.question.time_limit ? getSecondsHumanized(props.question.time_limit) : '' }}</p>
      </v-col>
    </v-row>
  </v-container>
</template>
