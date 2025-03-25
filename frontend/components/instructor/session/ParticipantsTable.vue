<script lang="ts" setup>
import type { SessionReport } from '~/types/session'

const props = defineProps<{
  session: SessionReport
}>()

const headers = [
  { title: 'Participante', key: 'user.name', sortable: false },
  { title: 'Nota', key: 'grade', sortable: false },
  { title: 'Pontuação', key: 'score', sortable: false },
]
</script>

<template>
  <v-data-table :headers="headers" :items="props.session.players" hide-default-footer
    hover item-value="public_id">
    <template v-slot:headers="{ columns }">
      <tr class="table-header">
        <template v-for="column in columns" :key="column.key">
          <th>
            <span class="font-weight-bold">{{ column.title }}</span>
          </th>
        </template>
      </tr>
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.user.name }}</td>
        <td>{{ (item.grade * 10).toFixed(2).replace('.', ',') }}</td>
        <td>{{ item.score }} pts</td>
      </tr>
    </template>
  </v-data-table>
</template>

<style lang="sass" scoped>
.table-header
  background-color: #00000011
</style>
