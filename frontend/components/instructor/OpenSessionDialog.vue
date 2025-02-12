<script lang="ts" setup>
import { SessionTypes } from '~/types/session'

interface Props {
  quizTitle: string
  loading: boolean
}
const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'cancel'): void
  (e: 'open', mode: SessionTypes | null): void
}>()

const mode = ref<SessionTypes | null>(null)
</script>

<template>
  <v-card class="pa-8">
    <h1 class="mb-8">Criando sessão para {{ props.quizTitle }}</h1>
    <v-radio-group v-model="mode">
      <template v-slot:label>Tipo de jogo:</template>
      <v-radio label="Individual" :value="SessionTypes.INDIVIDUAL"></v-radio>
      <v-radio label="Equipes" :value="SessionTypes.GROUP"></v-radio>
    </v-radio-group>
    <v-card-actions class="pa-0">
      <v-btn variant="outlined" :disabled="loading" @click="emit('cancel')">Cancelar</v-btn>
      <v-btn variant="elevated" color="primary" :loading="loading" @click="emit('open', mode)">Criar sessão</v-btn>
    </v-card-actions>
  </v-card>
</template>
