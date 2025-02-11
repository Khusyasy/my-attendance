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
    <UCard class="w-min bg-white/75 backdrop-blur dark:bg-white/5">
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

        {{ editId }}

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

const editId = route.params.id;

const form = ref<Form<EventsPostSchema>>();
const state = reactive({
  name: undefined,
});
const pos = reactive({
  lat: 47.21322,
  long: -1.559482,
  radius: 500,
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

async function onSubmit(event: FormSubmitEvent<EventsPostSchema>) {
  event.preventDefault();
  loading.value = true;

  const res = await $fetch(`/api/events`, {
    method: "POST",
    body: {
      name: event.data.name,
      lat: pos.lat,
      long: pos.long,
      radius: pos.radius,
    },
  });
  // TODO: handle edit

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
    router.push("/events");
  }
}

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped></style>
