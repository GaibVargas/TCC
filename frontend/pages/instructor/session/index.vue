<script lang="ts" setup>
definePageMeta({
  middleware: 'is-instructor',
  layout: 'instructor',
})
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-2 pa-md-8">
    <InstructorSessionOngoingList />
    <v-row class="ma-0 mb-4" align="center">
      <h2 class="mr-4">Sessões</h2>
    </v-row>
    <v-row class="ma-0 pa-0">
      <InstructorSessionList />
    </v-row>
  </v-container>
</template>
