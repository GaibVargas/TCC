<script lang="ts" setup>
const props = defineProps<{
  ranking: {
    name: string
    points: number
  }[]
}>()
</script>

<template>
  <v-container fluid class="ma-0 pa-0">
    <h2>Ranking</h2>
    <v-icon size="x-large" class="icon">mdi-crown</v-icon>
    <v-list class="pa-4 border-thin border-opacity-50 rounded w-100" style="max-width: 600px;">
      <v-list-item v-for="position in ranking">
        <div class="d-flex justify-space-between">
          <span class="d-inline-block text-truncate w-75">{{ position.name }}</span>
          <span class="d-inline-block">{{ position.points }}</span>
        </div>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<style lang="sass" scoped>
.icon
  z-index: 2
  transform: translateY(40%)
  color: black
</style>

