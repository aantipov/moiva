<template>
  <div
    class="container text-center lg:w-9/12 xl:w-3/4"
    :class="items.length === 1 && 'mb-4'"
  >
    <h1>{{ title }}</h1>
  </div>

  <div class="content container mb-6 lg:w-9/12 xl:w-3/4">
    <div
      v-for="item in items"
      :key="item.name"
      class="flex flex-col antialiased"
    >
      <h2 v-if="items.length > 1" class="self-center">{{ item.name }}</h2>

      <p
        v-for="(p, i) in getItemDescription(item)"
        :key="i"
        class="self-center pb-2"
      >
        {{ p }}
      </p>
      <p v-if="getItemAlternatives(item).length" class="flex flex-wrap">
        <span class="font-bold">Alternatives</span>:
        {{ getItemAlternatives(item).join(', ') }}
      </p>
      <p v-if="getItemTags(item).length" class="flex flex-wrap">
        <span class="font-bold">Tags</span>:
        <Tag v-for="(tag, i) in getItemTags(item)" :key="i" :value="tag" />
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { $trimmedLibraries, $isLoading } from '@/nanostore/trimmedLibraries';
import { NpmPackageT, ReadonlyNpmPackageT } from '@/libraryApis';
import { useStore } from '@nanostores/vue';
import Tag from '@/components/Tag.vue';
import { getNpmLibraryByNpm } from '@/data';
import { hasAiInfo } from '@/shared-types';

const props = defineProps<{ data: NpmPackageT[] }>();
const libs = useStore($trimmedLibraries);
const firstLoadingFinished = ref(false);
const items = computed(() =>
  firstLoadingFinished.value
    ? libs.value.map((item) => item.npmPackage)
    : props.data
);
const aliases = computed(() =>
  items.value.map((item) => getNpmLibraryByNpm(item.name)?.alias || item.name)
);
const title = computed(() =>
  items.value.length === 1
    ? `${aliases.value[0]}: Detailed Overview & Metrics`
    : `Head-to-Head: ${aliases.value.join(' vs ')} Analysis`
);
function getItemDescription(item: NpmPackageT | ReadonlyNpmPackageT) {
  return hasAiInfo(item.ai) ? item.ai.description : [item.description];
}
function getItemTags(item: NpmPackageT | ReadonlyNpmPackageT) {
  return hasAiInfo(item.ai) ? item.ai.tags : [];
}
function getItemAlternatives(item: NpmPackageT | ReadonlyNpmPackageT) {
  return hasAiInfo(item.ai) ? item.ai.alternatives : [];
}

// After first load, we need to recompute title and items (make them reactive)
$isLoading.subscribe((isLoading) => {
  if (!isLoading && libs.value.length > 0) {
    firstLoadingFinished.value = true;
  }
});
</script>
