<template>
  <div class="flex h-[50vh] flex-col items-center justify-start gap-4 p-4">
    <div class="flex w-full items-center justify-start gap-2">
      <UButton
        icon="i-heroicons-chevron-left-20-solid"
        variant="soft"
        @click="router.back()"
      />
      <h2 class="text-xl font-bold">{{ editId ? "Edit" : "Create" }} Event</h2>
    </div>
    <UCard
      class="w-min min-w-[400px] bg-white/75 backdrop-blur dark:bg-white/5"
    >
      <UForm
        ref="form"
        :schema="eventsPostSchema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UAlert
          v-if="errorMessage"
          color="red"
          variant="solid"
          :description="errorMessage"
        />

        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>

        <CustomMap v-model="pos" />

        <UButton type="submit" :loading="loading">
          {{ editId ? "Update" : "Submit" }}
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import type { Form, FormSubmitEvent } from "#ui/types";

const router = useRouter();
const route = useRoute();

const form = ref<Form<EventsPostSchema>>();
const state = reactive<{
  name: string | undefined;
}>({
  name: undefined,
});
const pos = ref<{
  lat: number | null;
  long: number | null;
  radius: number | null;
}>({
  lat: null,
  long: null,
  radius: null,
});

// only fetch if editing
const editId = route.query.id ?? null;
const isEdit = editId !== null;
const { data: prev } = await useFetch(`/api/events/${editId}`, {
  immediate: isEdit,
});
if (prev.value?.status === "success") {
  state.name = prev.value.data.name;
  pos.value.lat = prev.value.data.lat;
  pos.value.long = prev.value.data.long;
  pos.value.radius = prev.value.data.radius;
}

const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<EventsPostSchema>) {
  event.preventDefault();
  loading.value = true;

  let res;
  if (isEdit) {
    res = await $fetch(`/api/events/${editId}`, {
      method: "PUT",
      body: {
        name: event.data.name,
        lat: pos.value.lat,
        long: pos.value.long,
        radius: pos.value.radius,
      },
    });
  } else {
    res = await $fetch(`/api/events`, {
      method: "POST",
      body: {
        name: event.data.name,
        lat: pos.value.lat,
        long: pos.value.long,
        radius: pos.value.radius,
      },
    });
  }

  loading.value = false;

  if (res.status === "fail") {
    if (typeof res.data === "string") {
      errorMessage.value = res.data;
    } else {
      form.value?.setErrors(
        res.data.map((err) => ({
          path: `${err.path}`,
          message: err.message,
        })),
      );
    }
  } else if (res.status === "success") {
    // TODO: show toast message
    router.push("/events");
  }
}

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped></style>
