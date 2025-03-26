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
const subheaders = [
  { title: 'Participante', key: 'player.user.name', sortable: false },
  { title: 'Resposta', key: 'given_answer', sortable: false },
  { title: 'Resultado', key: 'is_correct', sortable: false },
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
  <v-card>
    <v-sheet rounded="sm" border>
      <v-data-table v-model:expanded="expended" :headers="headers" :items="props.session.quiz.questions" hide-default-footer
        item-value="public_id">
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
          <tr @click="toggleExpend(item.public_id)" class="table-row" :class="{ 'table-row-expended': isExpended(item.public_id) }">
            <td>{{ item.description }}</td>
            <td>{{ translateQuestionType(item.type) }}</td>
            <td>{{ (item.correct_answer_percentage * 100).toFixed(2).replace('.', ',') }}%</td>
          </tr>
        </template>
        <template v-slot:expanded-row="{ columns, item }">
          <tr class="pa-4 table-row-expended">
            <td :colspan="columns.length" class="pa-4">
              <v-card flat>
                <v-sheet rounded="sm" border>
                  <v-data-table :headers="subheaders" :items="item.answers" hide-default-footer no-data-text="Não há respostas para essa questão">
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
                      <tr>
                        <td>{{ item.player.user.name }}</td>
                        <td>{{ item.given_answer }}</td>
                        <td>{{ item.is_correct ? 'Correto' : 'Incorreto' }}</td>
                      </tr>
                    </template>
                  </v-data-table>
                </v-sheet>
              </v-card>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-sheet>
  </v-card>
</template>

<style lang="sass" scoped>
.table-header
  background-color: #00000011
.table-row-expended
  background-color: #0000000a
.table-row
  cursor: pointer
</style>
