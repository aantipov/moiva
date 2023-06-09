<template>
  <div
    class="container text-center lg:w-9/12 xl:w-2/4"
    :class="showItems && items.length === 1 && 'mb-4'"
  >
    <h1>{{ title }}</h1>
  </div>

  <div v-if="showItems" class="mb-6">
    <div
      v-for="item in items"
      :key="item.name"
      class="content container flex flex-col items-center antialiased"
    >
      <h2 v-if="items.length > 1">{{ item.name }}</h2>
      <template v-if="item.description">
        <p v-for="(p, i) in item.description" :key="i" class="max-w-3xl pb-2">
          {{ p }}
        </p>
      </template>
      <template v-else>
        <p class="max-w-3xl">
          Information about the package will be available soon.
        </p>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { $trimmedLibraries, $isLoading } from '@/nanostore/trimmedLibraries';
import { useStore } from '@nanostores/vue';

interface Item {
  name: string;
  alias: string;
  description: readonly string[] | null;
}
// eslint-disable-next-line vue/no-setup-props-destructure
const props = defineProps<{ data: Item[] }>();
const libs = useStore($trimmedLibraries);
const firstLoadingFinished = ref(false);
const title = computed(() =>
  firstLoadingFinished.value
    ? libs.value.map((item) => item.alias).join(' vs ')
    : props.data.map((item) => item.alias).join(' vs ')
);
const items = computed(() =>
  firstLoadingFinished.value
    ? libs.value.map((item) => ({
        name: item.npmPackage?.name || item.repo?.repoId,
        alias: item.alias,
        description: item.npmPackage?.ai?.description || null,
      }))
    : props.data
);
const showItems = computed(() =>
  items.value.some((item) => !!item.description)
);

// This is a hack to avoid mis-hidration issues
// eslint-disable-next-line @typescript-eslint/no-empty-function
watch([title, items], () => {}, { immediate: true, deep: true });

// After first load, we need to recompute title and items (make them reactive)
$isLoading.subscribe((isLoading) => {
  if (!isLoading && !firstLoadingFinished.value) {
    firstLoadingFinished.value = true;
  }
});
</script>
