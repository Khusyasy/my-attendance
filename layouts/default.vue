<template>
  <div>
    <header
      class="sticky top-0 z-50 -mb-px border-b border-gray-200 bg-white/75 backdrop-blur dark:border-gray-800 dark:bg-white/5"
    >
      <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4"
      >
        <div class="flex flex-row items-center gap-3">
          <UButton
            :icon="
              open
                ? 'i-heroicons-x-mark-20-solid'
                : 'i-heroicons-bars-3-20-solid'
            "
            variant="ghost"
            color="gray"
            @click="toggle"
          />
          <h1 class="text-2xl font-bold">MyAttendance</h1>
        </div>
        <div class="flex flex-row items-center gap-3">
          <ClientOnly>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              color="primary"
              variant="outline"
              aria-label="Theme"
              @click="isDark = !isDark"
            />
            <template #fallback>
              <div class="h-8 w-8" />
            </template>
          </ClientOnly>
          <UAvatar
            size="md"
            src="https://picsum.photos/seed/avatar/40"
            alt="Avatar"
          />
        </div>
      </div>
    </header>

    <div class="flex flex-row">
      <aside>
        <nav
          class="fixed top-16 h-screen w-64 border-r border-gray-200 bg-slate-100/90 backdrop-blur dark:border-gray-800 dark:bg-white/15"
          :class="{ hidden: !open }"
        >
          <div class="flex h-full w-full flex-col">
            <ULink
              v-for="link in navLinks"
              :key="link.name"
              :to="link.to"
              active-class="text-primary bg-slate-200/50 dark:bg-white/5"
              class="h-fit w-full px-4 py-2 hover:bg-white/50 hover:dark:bg-white/10"
            >
              <UIcon :name="link.icon" class="mr-2" />
              {{ link.name }}
            </ULink>
          </div>
        </nav>
      </aside>
      <div
        class="flex w-full justify-center"
        :class="{ 'ml-0': !open, 'ml-64': open }"
        style="min-height: calc(100vh - 4rem)"
      >
        <div class="max-w-7xl flex-1">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const open = useState("drawer", () => true);

const toggle = () => {
  open.value = !open.value;
};

const { getRole } = useAuthRole();
const role = await getRole();

const navLinks = [
  { name: "Dashboard", to: "/", icon: "i-heroicons-home-20-solid" },
];

if (role === "admin") {
  navLinks.push(
    ...[
      { name: "Users", to: "/users", icon: "i-heroicons-user-group-20-solid" },
      {
        name: "Courses",
        to: "/courses",
        icon: "i-heroicons-academic-cap-20-solid",
      },
    ],
  );
} else if (role === "teacher") {
  navLinks.push(
    ...[
      {
        name: "Classes",
        to: "/classes",
        icon: "i-heroicons-academic-cap-20-solid",
      },
      {
        name: "Summary",
        to: "/summary",
        icon: "i-heroicons-chart-pie-20-solid",
      },
    ],
  );
} else if (role === "student") {
  navLinks.push(
    ...[
      {
        name: "Scan",
        to: "/scan",
        icon: "i-heroicons-camera-20-solid",
      },
      {
        name: "History",
        to: "/history",
        icon: "i-heroicons-clock-20-solid",
      },
      {
        name: "Summary",
        to: "/summary",
        icon: "i-heroicons-chart-pie-20-solid",
      },
    ],
  );
}

const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});
</script>

<style scoped></style>
