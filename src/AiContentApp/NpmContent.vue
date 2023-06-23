<template>
  <div class="flex flex-col antialiased">
    <h2 v-if="showTitle" class="self-center font-mono">{{ pkg.name }}</h2>

    <p class="flex items-center">
      <a
        v-if="showHomeLink"
        v-tooltip.html="'Home Page'"
        :href="pkg.homepage"
        target="_blank"
        rel="noopener"
        class="mr-1 text-black"
      >
        <HomeIcon />
      </a>
      <a
        v-tooltip.html="'View package info on npmjs.com'"
        :href="npmjsLink"
        target="_blank"
        rel="noopener"
        class="mr-1 flex items-end text-black"
      >
        <NpmIcon />
        <span class="font-mono text-sm"> v{{ pkg.version }} </span>
      </a>
      <a
        v-tooltip.html="'GitHub Repository'"
        :href="`https://github.com/${pkg.repoId}`"
        target="_blank"
        rel="noopener"
        class="mr-1 text-black"
      >
        <GithubIcon />
      </a>

      <img
        v-tooltip.html="pkgTypes.tooltip"
        :alt="pkgTypes.alt"
        :src="`https://img.shields.io/badge/types-${pkgTypes.name}-${pkgTypes.color}?logo=typescript&logoColor=FFFFFF`"
      />
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
import HomeIcon from '@/icons/HomeIcon.vue';
import GithubIcon from '@/icons/GithubIcon.vue';
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
const showHomeLink = computed(
  () =>
    !!props.pkg.homepage &&
    props.pkg.homepage.startsWith('https://') &&
    !props.pkg.homepage.includes('github.com')
);
const pkgTypes = computed(() => {
  if (props.pkg.hasBuiltinTypes) {
    return {
      name: 'bundled',
      color: '449824',
      tooltip:
        '<div class="tippy-content"> Types definitions are bundled with the npm package</div>',
      alt: 'Types definitions are bundled with the npm package',
    };
  } else if (props.pkg.hasOtherTypes) {
    return {
      name: 'separate',
      color: 'yellow',
      tooltip: `Types definitions are provided via a separate npm package: <span class="font-mono">${props.pkg.typesPackageName}</span>`,
      alt: `Types definitions are provided via a separate npm package: ${props.pkg.typesPackageName}`,
    };
  } else {
    return {
      name: 'missing',
      color: 'E34F26',
      tooltip: "The package doesn't have any types definitions",
      alt: "The package doesn't have any types definitions",
    };
  }
});
</script>
