<template>
  <v-btn v-if="props.modelValue" @click="toggleCheckbox" :ripple="false" density="compact" flat icon="mdi-check-circle">
  </v-btn>
  <v-btn v-else @click="toggleCheckbox" :ripple="false" density="compact" flat icon="mdi-circle-outline">
  </v-btn>
</template>

<script setup>
const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

function toggleCheckbox() {
  emit('update:modelValue', !props.modelValue)
}
</script>
