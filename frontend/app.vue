<script lang="ts" setup>
const session = useSessionStore()
</script>


<template>
  <v-app>
    <NuxtLayout>
      <h1>{{ session.connection_status }}</h1>
      <NuxtPage/>
      <ConfirmDialog />
    </NuxtLayout>
  </v-app>
</template>
