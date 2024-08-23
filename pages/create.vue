<script setup lang="ts">
const router = useRouter();

async function create() {
  const { data } = await useFetch("/api/qr", {
    method: "POST",
  });
  console.log(data);

  router.push("/qr/" + data.value?.id);
}
</script>

<template>
  <div>
    <h1>GENERATE QR</h1>
    <button
      class="rounded bg-green-300 px-2 py-1 hover:bg-green-400"
      @click="create"
    >
      create now
    </button>
  </div>
</template>
