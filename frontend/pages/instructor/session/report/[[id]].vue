<script lang="ts" setup>
import { TZDate } from '@date-fns/tz'
import { format } from 'date-fns'
import { QuestionType } from '~/types/quiz'
import { SessionGradesStatus, SessionStatus, type SessionReport } from '~/types/session'

definePageMeta({
  middleware: 'is-instructor',
  layout: 'instructor',
})

const tab = ref("question")

const session = ref<SessionReport>(
  {
    public_id: '8b9e9cb9-13d1-49fc-88d0-560ffd0fa49c',
    code: 'aaa',
    status: SessionStatus.FINISHED,
    grades_status: SessionGradesStatus.SENDED,
    quiz: {
      public_id: '8d301fd3-fd70-408c-9003-564728817893',
      title: 'Computação',
      is_deleted: false,
      questions: [
        {
          public_id: 'f5703dd4-5133-4982-97b7-32d9bb698feb',
          type: QuestionType.MULTI_CHOICE,
          description: 'Qual das seguintes estruturas de dados segue a política FIFO (First In, First Out)?',
          time_limit: 60,
          correct_text_answer: '',
          is_deleted: false,
          answers: [],
          correct_answer_percentage: 0
        },
        {
          public_id: 'ab4f38ec-480c-4b2c-acc2-49f775a1b596',
          type: QuestionType.MULTI_CHOICE,
          description: 'Qual das opções abaixo é um princípio fundamental da programação orientada a objetos (OOP)?',
          time_limit: 60,
          correct_text_answer: '',
          is_deleted: false,
          answers: [
            {
              value: '783c6566-0ca1-4778-b9f2-9fe72ac7b2b0',
              player: {
                user: {
                  public_id: '02804be2-3734-4ee2-b1da-9c9f943c1c9c',
                  name: 'Aluno 3 Usuário'
                }
              },
              given_answer: 'Encapsulamento',
              is_correct: true
            }
          ],
          correct_answer_percentage: 0.5
        },
        {
          public_id: '54e697c2-9d48-4cbb-9550-fa0051877abb',
          type: QuestionType.MULTI_CHOICE,
          description: 'Qual dos seguintes algoritmos é mais eficiente para ordenar uma grande quantidade de dados na média dos casos?',
          time_limit: 60,
          correct_text_answer: '',
          is_deleted: false,
          answers: [
            {
              value: '1f3a3d09-5554-4190-b742-6735ddc3889f',
              player: {
                user: {
                  public_id: '02804be2-3734-4ee2-b1da-9c9f943c1c9c',
                  name: 'Aluno 3 Usuário'
                }
              },
              given_answer: 'Quick Sort',
              is_correct: true
            }
          ],
          correct_answer_percentage: 0.5
        },
        {
          public_id: '835652dd-e3e1-4327-819d-aa62d21461a1',
          type: QuestionType.TEXT,
          description: 'No contexto de bancos de dados relacionais, qual comando SQL é utilizado para recuperar dados de uma tabela?',
          time_limit: null,
          correct_text_answer: 'SELECT',
          is_deleted: false,
          answers: [],
          correct_answer_percentage: 0
        },
        {
          public_id: '98004cdf-3ca4-4ebc-9bce-88e02c723e9b',
          type: QuestionType.TRUE_OR_FALSE,
          description: ' A busca binária pode ser aplicada a qualquer conjunto de dados, independentemente de estar ordenado ou não.',
          time_limit: null,
          correct_text_answer: '',
          is_deleted: true,
          answers: [],
          correct_answer_percentage: 0
        },
        {
          public_id: 'f036af1c-72a1-45cf-be3a-9790e62d79d5',
          type: QuestionType.TRUE_OR_FALSE,
          description: ' A busca binária pode ser aplicada a qualquer conjunto de dados, independentemente de estar ordenado ou não.',
          time_limit: null,
          correct_text_answer: '',
          is_deleted: false,
          answers: [
            {
              value: '11f8c761-bca7-4a6e-8e59-48ebef22477a',
              player: {
                user: {
                  public_id: '02804be2-3734-4ee2-b1da-9c9f943c1c9c',
                  name: 'Aluno 3 Usuário'
                }
              },
              given_answer: 'Falso',
              is_correct: true
            }
          ],
          correct_answer_percentage: 0.5
        }
      ]
    },
    players: [
      {
        grade: 0,
        score: 0,
        user: {
          public_id: '0bef9992-0ee1-41af-87bd-0e0e398e2de8',
          name: 'Aluno 1 Usuário'
        }
      },
      {
        grade: 0.6,
        score: 313,
        user: {
          public_id: '02804be2-3734-4ee2-b1da-9c9f943c1c9c',
          name: 'Aluno 3 Usuário'
        }
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  })

const session_createdAt = computed(() => {
  const date = new TZDate(session.value.createdAt, "America/Sao_Paulo")
  return format(date, 'dd/MM/yyyy HH:mm')
})
const session_updatedAt = computed(() => {
  const date = new TZDate(session.value.updatedAt, "America/Sao_Paulo")
  return format(date, 'dd/MM/yyyy HH:mm')
})

const toast = useNuxtApp().$toast
const are_grades_loading = ref(false)
const grades_sended = ref(false)
const were_grades_send = computed(() => grades_sended.value || session.value.grades_status === SessionGradesStatus.SENDED)
async function sendGrades() {
  const confirmed = await useNuxtApp().$confirm({
    title: "Envio de notas",
    message: "Tem certeza de que deseja enviar as notas dos participantes ao Moodle?",
    confirmText: "Sim",
  })

  if (!confirmed) return
  try {
    are_grades_loading.value = true
    await useApiFetch(`/session/send-grades/${session.value.code}`, {
      method: 'POST'
    })
    grades_sended.value = true
    toast.success('Notas enviadas!')
  } catch (error) {
    console.error('Error sendind grades', error)
    toast.error('Erro ao enviar notas. Tente novamente mais tarde.')
  } finally {
    are_grades_loading.value = false
  }
}

const is_loading_report = ref(false)
async function getSessionReport() {
  try {
    await delay(1000)
    toast.success('Relatório pronto. Verifique a aba de downloads.')
  } catch (error) {
    toast.error('Erro ao gerar relatório. Tente novamente mais tarde.')
  }
}
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-2 pa-md-8">
    <div class="d-flex justify-space-between mb-6">
      <div class="title">
        <h1 class="text-h3 font-weight-bold mb-2">{{ session.quiz.title }}</h1>
        <p class="text-subtitle-2">Iniciado em: {{ session_createdAt }}</p>
        <p class="text-subtitle-2">Última atualização em: {{ session_updatedAt }}</p>
      </div>
      <div class="actions d-flex flex-column ga-2">
        <v-btn v-if="!were_grades_send" variant="outlined" density="compact" :loading="are_grades_loading" @click.stop="sendGrades">Enviar
          notas</v-btn>
        <v-btn variant="outlined" density="compact" :loading="is_loading_report" @click.stop="getSessionReport">Gerar relatório</v-btn>
      </div>
    </div>
    <v-tabs v-model="tab" density="compact" selected-class="active-tab">
      <v-tab value="question">Questões</v-tab>
      <v-tab value="participant">Participantes</v-tab>
    </v-tabs>
  </v-container>
</template>

<style lang="sass" scoped>
.active-tab
  font-weight: bolder
</style>
