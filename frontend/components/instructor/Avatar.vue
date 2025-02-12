<script lang="ts" setup>
const user = useUser()
const auth = useAuthStore()

function logout() {
  auth.logout()
  navigateTo('/')
}
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn flat size="40" v-bind="props">
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item>{{ user.name }}</v-list-item>
      <v-list-item>
        <v-btn variant="outlined" class="w-100" @click="logout">Sair</v-btn>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
