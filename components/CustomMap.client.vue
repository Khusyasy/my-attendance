<template>
  <div>
    <div style="height: 300px; width: 400px">
      <LMap
        ref="map"
        :zoom="zoom"
        :center="center"
        :use-global-leaflet="true"
        @ready="onMapReady"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&amp;copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          layer-type="base"
          name="OpenStreetMap"
        />
      </LMap>
    </div>
    <div>
      <div>
        <label for="lat">Latitude</label>
        <input v-model="pos.lat" type="text" />
      </div>
      <div>
        <label for="long">Longitude</label>
        <input v-model="pos.long" type="text" />
      </div>
      <div>
        <label for="radius">Radius</label>
        <input
          v-model="pos.radius"
          type="number"
          min="100"
          max="999999"
          step="100"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import L from "leaflet";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = ref<any | null>(null);
const zoom = ref(12);

const pos = ref({
  lat: props.modelValue?.lat,
  long: props.modelValue?.long,
  radius: props.modelValue?.radius,
});

const center = computed<L.PointTuple>(() => [pos.value.lat, pos.value.long]);
const radius = computed<number>(() => pos.value.radius);

watch(
  pos,
  (newPos) => {
    emit("update:modelValue", newPos);
  },
  {
    deep: true,
  },
);

async function onMapReady() {
  const userPos = await getGeolocation();
  pos.value = {
    lat: userPos.coords.latitude,
    long: userPos.coords.longitude,
    radius: userPos.coords.accuracy,
  };

  const posMarker = L.marker(center.value).addTo(map.value.leafletObject);

  const posCircle = L.circle(center.value, {
    color: "blue",
    fillColor: "#ddf",
    fillOpacity: 0.2,
    radius: radius.value,
  }).addTo(map.value.leafletObject);

  map.value.leafletObject.on("click", (e: L.LeafletMouseEvent) => {
    pos.value.lat = e.latlng.lat;
    pos.value.long = e.latlng.lng;
  });

  watch(
    center,
    (newCenter) => {
      posMarker.setLatLng(newCenter);
      posCircle.setLatLng(newCenter);
    },
    { deep: true },
  );

  watch(
    radius,
    (newRadius) => {
      posCircle.setRadius(newRadius);
    },
    { deep: true },
  );
}
</script>

<style scoped></style>
