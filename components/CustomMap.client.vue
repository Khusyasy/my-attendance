<template>
  <div style="height: 500px; width: 500px">
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
</template>

<script setup lang="ts">
import type { PointTuple } from "leaflet";
import L from "leaflet";

const props = defineProps<{ pos: GeolocationPosition }>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const map = ref<any | null>(null);
const zoom = ref(12);
const center = ref<PointTuple>([47.21322, -1.559482]);

async function onMapReady() {
  const pos = props.pos;
  center.value = [pos.coords.latitude, pos.coords.longitude];

  // console.log(map.value.leafletObject);
  L.marker(center.value).addTo(map.value.leafletObject);

  L.circle(center.value, {
    color: "blue",
    fillColor: "#ddf",
    fillOpacity: 0.2,
    radius: 500,
  }).addTo(map.value.leafletObject);
}
</script>

<style scoped></style>
