<script setup lang="ts">
const router = useRouter();

const { data } = await useFetch("/api/qr");

const pos = ref<{
  lat: number;
  long: number;
  radius: number;
} | null>(null);

function onNewPosition(newPos: { lat: number; long: number; radius: number }) {
  pos.value = newPos;
}

async function create() {
  try {
    if (!pos.value) {
      alert("Cannot get location");
      return;
    }

    const res = await $fetch("/api/qr", {
      method: "POST",
      body: {
        lat: pos.value.lat,
        long: pos.value.long,
        radius: pos.value.radius,
      },
    });

    if (res.status === "fail") {
      alert(res.data);
    } else if (res.status === "success") {
      router.push("/qr/" + res.data.id);
    }
  } catch {
    alert("Please enable location services");
  }
}
</script>

<template>
  <div>
    <h1>GENERATE QR</h1>
    <div>
      <CustomMap @new-position="onNewPosition" />
      <button
        class="rounded bg-green-300 px-2 py-1 hover:bg-green-400"
        @click="create"
      >
        create now
      </button>
    </div>

    <ul v-if="data && data.status === 'success'">
      <li v-for="qr in data.data" :key="qr.id">
        <NuxtLink :to="'/qr/' + qr.id"> QR ID: {{ qr.id }} </NuxtLink>
      </li>
    </ul>
  </div>
</template>
