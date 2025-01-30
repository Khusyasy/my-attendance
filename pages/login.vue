<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <UCard class="w-full max-w-sm bg-white/75 backdrop-blur dark:bg-white/5">
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <h2 class="text-xl font-bold">Login to MyAttendance</h2>

        <UAlert
          v-if="errorMessage"
          color="red"
          variant="solid"
          :description="errorMessage"
        />

        <UFormGroup label="Username" name="username">
          <UInput v-model="state.username" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit" :loading="loading"> Login </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  username: z.string(),
  password: z.string().min(8, "Must be at least 8 characters"),
});
type Schema = z.output<typeof schema>;
const state = reactive({
  username: undefined,
  password: undefined,
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const router = useRouter();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  event.preventDefault();
  loading.value = true;

  const { data, error } = await useFetch("/api/auth/login", {
    method: "POST",
    body: {
      username: event.data.username,
      password: event.data.password,
    },
  });

  loading.value = false;

  if (error.value) {
    console.log(JSON.stringify(error.value));
    errorMessage.value = error.value.statusMessage ?? "An error occurred";
    return;
  }

  console.log(data.value);
  router.push("/");
}
</script>

<style scoped></style>
