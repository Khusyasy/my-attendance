<script setup lang="ts">
const router = useRouter();

const { data } = await useFetch("/api/qr");

const pos = ref<GeolocationPosition | null>(null);

onMounted(async () => {
  pos.value = await getGeolocation();
});

async function create() {
  try {
    if (!pos.value) {
      alert("Cannot get location");
      return;
    }

    const { data } = await useFetch("/api/qr", {
      method: "POST",
      body: {
        lat: pos.value.coords.latitude,
        long: pos.value.coords.longitude,
      },
    });

    router.push("/qr/" + data.value?.id);
  } catch {
    alert("Please enable location services");
  }
}
</script>

<template>
  <div>
    <h1>GENERATE QR</h1>
    <div>
      <CustomMap v-if="pos" :pos="pos" />
      <button
        class="rounded bg-green-300 px-2 py-1 hover:bg-green-400"
        @click="create"
      >
        create now
      </button>
    </div>

    <ul v-if="data">
      <li v-for="qr in data" :key="qr.id">
        <NuxtLink :to="'/qr/' + qr.id"> QR ID: {{ qr.id }} </NuxtLink>
      </li>
    </ul>
  </div>
</template>
