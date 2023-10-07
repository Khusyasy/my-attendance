<template>
  <v-container>
    <form @submit.prevent="submit">
      <v-text-field v-model="username.value.value" :error-messages="username.errorMessage.value" label="Username"
        name="username" required></v-text-field>

      <v-text-field v-model="password.value.value" :error-messages="password.errorMessage.value" label="Password"
        name="password" required type="password"></v-text-field>

      <v-btn class="me-4" type="submit">
        submit
      </v-btn>
    </form>
    <v-btn @click="logout">
      logout
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useField, useForm } from 'vee-validate'

const { handleSubmit } = useForm({
  validationSchema: {
    username: {
      required: true,
    },
    password: {
      required: true,
    }
  }
})
const username = useField('username')
const password = useField('password')

const submit = handleSubmit(async (values) => {
  const { data: res } = useFetch('/api/auth/login', {
    method: 'POST',
    body: values,
  })

  console.log(res.value)

  if (res.value?.status == 'success') {
    await navigateTo('/admin')
  }
})

const logout = async () => {
  const { data: res } = useFetch('/api/auth/logout', {
    method: 'DELETE'
  })

  console.log(res.value)

  if (res.value?.status == 'success') {
    await navigateTo('/')
  }
}
</script>

<style scoped>
</style>
