<script lang="ts" setup>
import { QuestionType } from '~/types/quiz'
import type { SessionReport } from '~/types/session'

const props = defineProps<{
  session: SessionReport
}>()

const headers = [
  { title: 'Questão', key: 'description', sortable: false },
  { title: 'Tipo', key: 'type', sortable: false },
  { title: 'Aproveitamento', key: 'correct_answer_percentage', sortable: false },
]

const QuestionTypeTranslation: Record<QuestionType, string> = {
  [QuestionType.MULTI_CHOICE]: "Múltipla Escolha",
  [QuestionType.TRUE_OR_FALSE]: "Verdadeiro ou Falso",
  [QuestionType.TEXT]: "Texto",
}

function translateQuestionType(type: QuestionType): string {
  return QuestionTypeTranslation[type] || type;
}

const expended = ref<string[]>([])
function toggleExpend(row_id: string) {
  if (isExpended(row_id))
    expended.value = expended.value.filter(r => r !== row_id)
  else
    expended.value.push(row_id)
}
function isExpended(row_id: string) {
  return expended.value.includes(row_id)
}
</script>

<template>
  <v-data-table v-model:expanded="expended" :headers="headers" :items="props.session.quiz.questions" hide-default-footer
    hover item-value="public_id">
    <template v-slot:headers="{ columns }">
      <tr class="table-header">
        <template v-for="column in columns" :key="column.key">
          <th>
            <span class="font-weight-bold">{{ column.title }}</span>
          </th>
        </template>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr @click="toggleExpend(item.public_id)" class="table-row">
        <td>{{ item.description }}</td>
        <td>{{ translateQuestionType(item.type) }}</td>
        <td>{{ (item.correct_answer_percentage * 100).toFixed(2).replace('.', ',') }}%</td>
      </tr>
    </template>
    <template v-slot:expanded-row="{ columns, item }">
      <tr>
        <td :colspan="columns.length">
          <span>
            Expanded
          </span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>

<style lang="sass" scoped>
.table-header
  background-color: #00000011
.table-row
  cursor: pointer
</style>
