<template>
  <div class="flex h-screen w-screen items-center justify-center">
    <UCard class="w-full max-w-sm bg-white/75 backdrop-blur dark:bg-white/5">
      <UForm
        :schema="loginPostSchema"
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

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
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
import type { FormSubmitEvent } from "#ui/types";

const state = reactive({
  email: undefined,
  password: undefined,
});

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const router = useRouter();

// TODO: create register
async function onSubmit(event: FormSubmitEvent<LoginPostSchema>) {
  event.preventDefault();
  loading.value = true;

  const res = await $fetch("/api/auth/login", {
    method: "POST",
    body: {
      email: event.data.email,
      password: event.data.password,
    },
  });

  loading.value = false;

  if (res.status === "fail") {
    errorMessage.value = res.data;
    return;
  } else if (res.status === "success") {
    router.push("/");
  }
}

definePageMeta({
  title: "Login to MyAttendance",
  layout: "empty",
});
</script>

<style scoped></style>
