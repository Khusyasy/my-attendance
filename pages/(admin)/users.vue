<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Manage Users</h2>
      <UButton to="">Create User</UButton>
    </div>
    <UCard>
      <div
        class="flex justify-between border-b border-gray-200 py-2 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filter..." />
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="filteredRows.length"
        />
      </div>
      <UTable
        v-model="selectedRows"
        :columns="columns"
        :rows="rows"
        :loading="status === 'pending'"
      >
        <template #actions-data="{ row }">
          <UButtonGroup orientation="horizontal">
            <UButton
              icon="i-heroicons-trash-20-solid"
              color="red"
              variant="solid"
              @click="() => console.log('// TODO: Delete', row.id)"
            />
            <UButton
              icon="i-heroicons-pencil-square-20-solid"
              color="primary"
              variant="solid"
              @click="() => console.log('// TODO: Edit', row.id)"
            />
          </UButtonGroup>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { data, status } = useFetch("/api/users");
const datas = computed(() => (data.value ? data.value.data : []));

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "username",
    label: "Username",
  },
  {
    key: "roleName",
    label: "Role",
  },
  {
    key: "actions",
  },
];

// selectable
const selectedRows = ref<unknown[]>([]);

// filter / search
const q = ref("");
const filteredRows = computed(() => {
  if (!q.value) {
    return datas.value;
  }

  return datas.value.filter((row) => {
    return Object.values(row).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

// pagination
const page = ref(1);
const pageCount = 5;
const rows = computed(() => {
  return filteredRows.value.slice(
    (page.value - 1) * pageCount,
    page.value * pageCount,
  );
});

definePageMeta({
  middleware: ["auth"],
});
</script>

<style scoped></style>
