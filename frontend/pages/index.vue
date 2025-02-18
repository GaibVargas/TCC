<script lang="ts" setup>
const total = ref(100)
const current = ref(50)
const rectangle_height = computed(() => total.value > 0 ? (current.value / total.value) * 100 : 0)
</script>

<template>
  <h1>Bem vindo!</h1>
  <v-slider v-model="total" step="1" max="100" min="0"></v-slider>
  <v-slider v-model="current" step="1" max="100" min="0"></v-slider>
  <v-container class="ma-0 pa-0 container border-thin d-flex justify-space-between">
    <div class="rectange-container d-flex flex-column align-center justify-end border-thin fill-height">
      <span class="font-weight-bold">{{ current }}</span>
      <div class="rectangle position-relative bg-success" :style="{ height: `${rectangle_height}%` }">
      </div>
    </div>
    <div class="rectange-container d-flex flex-column align-center justify-end border-thin fill-height">
      <span class="">{{ (current / 2).toFixed(2) }}</span>
      <div class="rectangle position-relative bg-grey" :style="{ height: `${rectangle_height / 2}%` }">
      </div>
    </div>
    <div class="rectange-container d-flex flex-column align-center justify-end border-thin fill-height">
      <span class="">{{ (current / 3).toFixed(2) }}</span>
      <div class="rectangle position-relative bg-grey" :style="{ height: `${rectangle_height / 3}%` }">
      </div>
    </div>
    <div class="rectange-container d-flex flex-column align-center justify-end border-thin fill-height">
      <span class="">{{ (current / 4).toFixed(2) }}</span>
      <div class="rectangle position-relative bg-grey" :style="{ height: `${rectangle_height / 4}%` }">
      </div>
    </div>
  </v-container>
</template>

<style lang="sass" scoped>
.container
  height: 400px
.rectangle
  width: 100px
  min-height: 10px
</style>
