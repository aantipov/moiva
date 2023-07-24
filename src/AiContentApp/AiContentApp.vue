<template>
  <div
    class="container text-center lg:w-9/12 xl:w-3/4"
    :class="items.length === 1 && 'mb-4'"
  >
    <h1>{{ title }}</h1>
  </div>

  <div class="content container mb-2 lg:w-9/12 xl:w-3/4">
    <NpmContent
      v-for="item in items"
      :key="item.npm.name"
      :npm="item.npm"
      :repo="item.repo"
      :ai="item.ai"
      :show-title="items.length > 1"
      :show-all-paragraphs="!showAiCompareData"
    />
  </div>

  <div
    v-if="aiComparisonData && showAiCompareData"
    class="content container mb-4 lg:w-9/12 xl:w-3/4"
  >
    <h2 class="flex justify-center">
      Fight!
      <FightIcon class="ml-2 inline-block" />
    </h2>

    <div v-for="item in aiComparisonData" :key="item.title">
      <h3 class="mb-1 mt-2">{{ item.title }}</h3>
      <div>
        {{ item.description }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import NpmContent from './NpmContent.vue';
import { $trimmedLibraries, $isLoading } from '@/nanostore/trimmedLibraries';
import { useStore } from '@nanostores/vue';
import { getNpmLibraryByNpm } from '@/data';
import {
  NpmInfoApiResponseT,
  NpmCompareApiResponseT,
  hasAiCompareInfo,
} from '@/shared-types';
import FightIcon from '@/icons/FightIcon.vue';

const props = defineProps<{
  data: NpmInfoApiResponseT[];
  aiComparison: NpmCompareApiResponseT | null; // null if error (might be 404 error)
  packages: string[];
}>();
const libs = useStore($trimmedLibraries);
const firstLoadingFinished = ref(false);
const items = computed(() =>
  firstLoadingFinished.value ? libs.value : props.data,
);
const aliases = computed(() =>
  items.value.map(
    (item) => getNpmLibraryByNpm(item.npm.name)?.alias || item.npm.name,
  ),
);
const title = computed(() =>
  items.value.length === 1
    ? `${aliases.value[0]}: Detailed Overview & Metrics`
    : `Head-to-Head: ${aliases.value.join(' vs ')} Analysis`,
);
const aiComparisonData = computed(() =>
  hasAiCompareInfo(props.aiComparison) ? props.aiComparison : null,
);
const showAiCompareData = computed(
  () =>
    !!aiComparisonData.value &&
    items.value.length === 2 &&
    props.packages.includes(items.value[0].npm.name) &&
    props.packages.includes(items.value[1].npm.name),
);
// After first load, we need to recompute title and items (make them reactive)
$isLoading.subscribe((isLoading) => {
  if (!isLoading && libs.value.length > 0) {
    firstLoadingFinished.value = true;
  }
});
</script>
