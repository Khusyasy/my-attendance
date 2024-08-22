<script setup lang="ts">
const count = ref(0);
</script>

<template>
  <div class="">
    <h1>Home page</h1>
    <button
      class="rounded bg-green-300 px-2 py-1 hover:bg-green-400"
      @click="count++"
    >
      counter {{ count }}
    </button>
  </div>
</template>
