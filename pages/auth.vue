<template>
  <div>
    <h1>
      AUTH
    </h1>
    <div>
      <input type="text" name="username" id="username" v-model="username">
      <input type="password" name="password" id="password" v-model="password">
      <button @click="login">
        login
      </button>
    </div>
    <button @click="logout">
      logout
    </button>
  </div>
</template>

<script setup lang="ts">
const username = ref('')
const password = ref('')

const login = () => {
  const { data } = useFetch('/api/auth/login', {
    method: 'POST',
    body: {
      username: username.value,
      password: password.value
    }
  })

  console.log(data)
}

const logout = () => {
  const { data } = useFetch('/api/auth/logout', {
    method: 'DELETE'
  })

  console.log(data)
}
</script>

<style scoped>
</style>
