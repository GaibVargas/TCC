<script lang="ts" setup>
const modelValue = defineModel<boolean>({ required: true })
const emit = defineEmits<{
  (e: 'update:modelValue', option: boolean): void
}>()

function toggleCheckbox() {
  emit('update:modelValue', !modelValue.value)
}
</script>

<template>
  <v-btn v-if="modelValue" @click="toggleCheckbox" :ripple="false" density="compact" flat icon="mdi-check-circle">
  </v-btn>
  <v-btn v-else @click="toggleCheckbox" :ripple="false" density="compact" flat icon="mdi-circle-outline">
  </v-btn>
</template>
