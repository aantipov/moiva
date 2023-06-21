<template>
  <div class="flex flex-col antialiased">
    <h2 v-if="showTitle" class="self-center font-mono">{{ pkg.name }}</h2>

    <p class="flex">
      <a
        v-tooltip.html="'View package info on npmjs.com'"
        :href="npmjsLink"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-end text-black"
      >
        <NpmIcon class="h-12 w-12 sm:h-6 sm:w-6" />
        <span class="font-mono text-sm"> v{{ pkg.version }} </span>
      </a>
    </p>

    <p v-for="(p, i) in description" :key="i" class="self-center pb-2">
      {{ p }}
    </p>

    <p v-if="alternatives.length" class="flex flex-wrap">
      <span class="font-bold">Alternatives</span>:
      {{ alternatives.join(', ') }}
    </p>

    <p v-if="tags.length" class="flex flex-wrap">
      <span class="font-bold">Tags</span>:
      <Tag v-for="(tag, i) in tags" :key="i" :value="tag" />
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ReadonlyNpmPackageT } from '@/libraryApis';
import Tag from '@/components/Tag.vue';
import NpmIcon from '@/icons/NpmMDIIcon.vue';
import { hasAiInfo } from '@/shared-types';

const props = defineProps<{ pkg: ReadonlyNpmPackageT; showTitle: boolean }>();
const description = computed(() =>
  hasAiInfo(props.pkg.ai) ? props.pkg.ai.description : [props.pkg.description]
);
const tags = computed(() => (hasAiInfo(props.pkg.ai) ? props.pkg.ai.tags : []));
const alternatives = computed(() =>
  hasAiInfo(props.pkg.ai) ? props.pkg.ai.alternatives : []
);
const npmjsLink = computed(
  () => `https://www.npmjs.com/package/${encodeURIComponent(props.pkg.name)}`
);
</script>
