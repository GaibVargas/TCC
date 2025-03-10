<script lang="ts" setup>
import type { Ranking } from '~/types/session'

const props = defineProps<{
  label?: string
  ranking: Ranking
}>()

const label = computed(() => props.label ?? 'Ranking')
</script>

<template>
  <v-container fluid class="ma-0 pa-0">
    <h2>{{ label }}</h2>
    <v-icon size="x-large" class="icon">mdi-crown</v-icon>
    <ul class="pa-4 border-thin border-opacity-50 rounded w-100 list" style="max-width: 600px;">
      <li v-for="position in ranking" class="ma-0 pa-2">
        <div class="d-flex align-top">
          <span class="mr-4 pt-2 font-weight-bold">{{ position.rank }}</span>
          <ul class="ma-0 pa-0 w-100 list">
            <li v-for="player in position.players" class="ma-0 px-0 py-2">
              <div class="d-flex align-center justify-space-between">
                <span class="d-inline-block text-truncate w-75">{{ player.name }}</span>
                <span class="d-inline-block">{{ player.points }}</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </v-container>
</template>

<style lang="sass" scoped>
.icon
  z-index: 2
  transform: translateY(40%)
  color: black
.list
  list-style: none
</style>
