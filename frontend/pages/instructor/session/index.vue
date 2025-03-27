<script lang="ts" setup>
import type { InstructorSessionList } from '#components'

definePageMeta({
  middleware: 'is-instructor',
  layout: 'instructor',
})

const finishedListRef = useTemplateRef('finishedListRef')

function sessionHasEnded(_public_id: string) {
  if (!finishedListRef.value) return
  finishedListRef.value.refresh_fetch?.()
}
</script>

<template>
  <v-container fluid class="ma-0 pa-sm-2 pa-md-8">
    <InstructorSessionOngoingList @end-session="sessionHasEnded" />
    <v-row class="ma-0 mb-4" align="center">
      <h2 class="mr-4">Sessões</h2>
    </v-row>
    <v-row class="ma-0 pa-0">
      <InstructorSessionList ref="finishedListRef"/>
    </v-row>
  </v-container>
</template>
