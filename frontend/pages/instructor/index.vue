<script lang="ts" setup>
definePageMeta({
  middleware: 'is-instructor'
})

const { data, error, status } = await useApiUseFetch('/quiz', { lazy: true })
</script>

<template>
  <h1>Olá instrutor</h1>
  <code>{{ status }}</code>
  <code v-if="error">{{ error }}</code>
  <code v-if="data">{{ data }}</code>
</template>
