<template>
  <div
    class="container text-center lg:w-9/12 xl:w-3/4"
    :class="items.length === 1 && 'mb-4'"
  >
    <h1>{{ title }}</h1>
  </div>

  <div class="content container mb-6 lg:w-9/12 xl:w-3/4">
    <NpmContent
      v-for="item in items"
      :key="item.npm.name"
      :npm="item.npm"
      :ai="item.ai"
      :show-title="items.length > 1"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NpmContent from './NpmContent.vue';
import { $trimmedLibraries, $isLoading } from '@/nanostore/trimmedLibraries';
import { useStore } from '@nanostores/vue';
import { getNpmLibraryByNpm } from '@/data';
import { NpmInfoApiResponseT } from '@/shared-types';

const props = defineProps<{ data: NpmInfoApiResponseT[] }>();
const libs = useStore($trimmedLibraries);
const firstLoadingFinished = ref(false);
const items = computed(() =>
  firstLoadingFinished.value ? libs.value : props.data
);
const aliases = computed(() =>
  items.value.map(
    (item) => getNpmLibraryByNpm(item.npm.name)?.alias || item.npm.name
  )
);
const title = computed(() =>
  items.value.length === 1
    ? `${aliases.value[0]}: Detailed Overview & Metrics`
    : `Head-to-Head: ${aliases.value.join(' vs ')} Analysis`
);

// After first load, we need to recompute title and items (make them reactive)
$isLoading.subscribe((isLoading) => {
  if (!isLoading && libs.value.length > 0) {
    firstLoadingFinished.value = true;
  }
});
</script>
