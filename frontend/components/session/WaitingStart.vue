<script lang="ts" setup>
const props = defineProps<{ quiz_title: string }>()
</script>

<template>
  <v-container fluid class="ma-0 pa-0 d-flex flex-column">
    <p class="text-center">Quiz: {{ props.quiz_title }}</p>
    <h2 class="text-center my-auto">Espere o organizador iniciar o jogo</h2>
  </v-container>
</template>
