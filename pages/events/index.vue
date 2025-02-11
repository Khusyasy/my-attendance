<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold">Manage Events</h2>
      <UButton to="events/form">Create Event</UButton>
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
              @click="onDelete(row.id)"
            />
            <UButton
              icon="i-heroicons-pencil-square-20-solid"
              color="primary"
              variant="solid"
              @click="onEdit(row.id)"
            />
          </UButtonGroup>
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const { data, status, refresh } = useFetch("/api/events");
const datas = computed(() => (data.value ? data.value.data : []));

const router = useRouter();

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "code",
    label: "Code",
  },
  {
    key: "actions",
  },
];

// selectable
const selectedRows = ref<unknown[]>([]);

const onEdit = (id: string) => {
  router.push(`/events/form?id=${id}`);
};

const onDelete = async (id: string) => {
  // TODO: better confirm dialog
  const ok = confirm("Are you sure you want to delete this event?");
  if (!ok) {
    return;
  }

  const res = await $fetch(`/api/events/${id}`, {
    method: "DELETE",
  });

  if (res.status == "fail") {
    // TODO: better alert
    alert(res.data);
    return;
  }

  refresh();
};

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
const pageCount = 10;
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
