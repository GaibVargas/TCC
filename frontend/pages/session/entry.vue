<script lang="ts" setup>
import type { VTextField } from 'vuetify/components'

definePageMeta({
  middleware: 'has-user',
})

const user = useUser()

const loading = ref(false)
const code = ref('')

function required(v: string) {
  return !!v || 'Sessão é obrigatório.'
}

const socket = useSocket()

const session_ref: Ref<InstanceType<typeof VTextField> | null> = ref(null)
async function enterSession() {
  if (!session_ref.value || !code.value) return
  const result = await session_ref.value.validate()
  if (result.length) return
  socket.emit('participant:join', { code: code.value })
}
</script>

<template>
  <v-container class="ma-0 pa-sm-2 pa-md-8 align-self-center d-flex flex-column fill-height align-center justify-center">
    <div class="welcome w-100 mb-16">
      <h2 class="text-center">Bem vindo,</h2>
      <h2 class="text-center">{{ user.name }}!</h2>
    </div>
    <div class="inputs w-100 justify-center">
      <v-text-field
        ref="session_ref"
        name="session"
        label="Código da sessão"
        id="session"
        variant="outlined"
        :readonly="loading"
        :rules="[required]"
        v-model="code"
      ></v-text-field>
      <v-btn class="w-100 mt-4" color="primary" :loading="loading" @click.stop="enterSession">Entrar</v-btn>
    </div>
  </v-container>
</template>

<style lang="sass" scoped>
.inputs
  max-width: 300px
</style>

