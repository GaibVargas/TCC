<script lang="ts" setup>
import type { InstructorSessionWaitingState } from '~/types/session'

const props = defineProps<{
  session: InstructorSessionWaitingState
  loading: boolean
}>()
const emit = defineEmits<{
  (e: 'start'): void
}>()
</script>

<template>
  <v-container fluid class="ma-0 pa-4 flex-fill d-flex flex-column align-center justify-center">
    <h2 class="mb-16 text-h4">{{ props.session.quiz.title }}</h2>
    <p class="text-body-1">Código para entrar no quiz game</p>
    <h1 class="text-h1 font-weight-bold mt-4 mb-16">{{ props.session.code }}</h1>
    <p class="text-body-1 mb-16">{{ props.session.participants.length }} participantes</p>
    <div class="btns d-flex ga-4">
      <v-btn variant="outlined" :disabled="loading">Cancelar</v-btn>
      <v-btn color="primary" @click="emit('start')" :loading="loading">Iniciar</v-btn>
    </div>
  </v-container>
</template>
