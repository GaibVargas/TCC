<template>
  <v-container fluid class="ma-0 px-8 border-b-thin">
    <ul class="d-flex ga-8 align-center justify-end" style="list-style: none;">
      <li><NuxtLink active-class="link-active" to="/lms" class="text-decoration-none link">LMS</NuxtLink></li>
      <li><NuxtLink active-class="link-active" to="/instructor/quiz" class="text-decoration-none link">Quizzes</NuxtLink></li>
      <li><NuxtLink active-class="link-active" to="/instructor/session" class="text-decoration-none link">Sessões</NuxtLink></li>
      <li><InstructorAvatar /></li>
    </ul>
  </v-container>
</template>

<style lang="sass" scoped>
.link
  color: var(--v-theme-primary)
  opacity: .8
  &:hover
    opacity: 1
  &-active
    opacity: 1
</style>

