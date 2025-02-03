<script lang="ts" setup>

</script>

<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <v-text-field
        name="name"
        label="Título do quiz"
        variant="plain"
        :hide-details="true"
        class="quiz-title font-weight-black"
      ></v-text-field>
      <div class="btns">
        <v-btn color="primary" class="mr-2">Salvar</v-btn>
        <v-btn>Sair</v-btn>
      </div>
    </v-row>
  </v-container>
</template>

<style lang="sass" scoped>
.quiz-title
  :deep(.v-field__input)
    font-size: 1.8rem !important
</style>
