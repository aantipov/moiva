<template>
  <div class="flex flex-col antialiased">
    <h2 v-if="showTitle" class="mb-1 self-center font-mono">{{ npm.name }}</h2>

    <p class="flex flex-wrap items-center justify-center">
      <a
        v-if="!!homepageUrl"
        v-tooltip.html="'Home Page'"
        :href="homepageUrl"
        target="_blank"
        rel="noopener"
        class="mr-2 text-black"
      >
        <HomeIcon />
      </a>
      <a
        v-tooltip.html="'GitHub Repository'"
        :href="`https://github.com/${npm.repoId}`"
        target="_blank"
        rel="noopener"
        class="mr-2 text-black"
      >
        <GithubIcon />
      </a>
      <a
        v-tooltip.html="'View package info on npmjs.com'"
        :href="npmjsLink"
        target="_blank"
        rel="noopener"
        class="mr-2 flex items-end text-black"
      >
        <NpmIcon />
      </a>
      <span class="mr-1 self-end font-mono text-sm">v{{ npm.version }},</span>
      <span v-if="npm.publishedAt" class="self-end text-sm"
        >published {{ publishedAt }}</span
      >
    </p>
    <p class="mb-3 mt-1 flex h-5 items-center justify-center">
      <img
        v-tooltip.html="status.tooltip"
        class="mr-2"
        height="20"
        :alt="status.alt"
        :src="`https://img.shields.io/badge/status-${status.name}-${status.color}?`"
      />

      <img
        v-tooltip.html="pkgTypes.tooltip"
        height="20"
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
import { NpmInfoApiResponseT, hasAiInfo } from '@/shared-types';
import { legacyLibraries } from '@/data/index';
import { formatDateFromNow } from '@/utils';

const props = defineProps<{
  npm: ReadonlyNpmPackageT;
  repo: NpmInfoApiResponseT['repo'];
  ai: NpmInfoApiResponseT['ai'];
  showTitle: boolean;
}>();
const description = computed(() =>
  hasAiInfo(props.ai) ? props.ai.description : [props.npm.description]
);
const tags = computed(() => (hasAiInfo(props.ai) ? props.ai.tags : []));
const alternatives = computed(() =>
  hasAiInfo(props.ai) ? props.ai.alternatives : []
);
const npmjsLink = computed(
  () => `https://www.npmjs.com/package/${encodeURIComponent(props.npm.name)}`
);
const homepageUrl = computed(() =>
  !!props.npm.homepage &&
  props.npm.homepage.startsWith('https://') &&
  !props.npm.homepage.includes('github.com')
    ? props.npm.homepage
    : props.repo.homepageUrl
    ? props.repo.homepageUrl
    : null
);
const publishedAt = computed(() =>
  props.npm.publishedAt ? formatDateFromNow(props.npm.publishedAt) : null
);
const timeInYearsSinceLastPublished = computed(() =>
  props.npm.publishedAt
    ? (new Date().getTime() - new Date(props.npm.publishedAt).getTime()) /
      (1000 * 60 * 60 * 24 * 365)
    : null
);
const status = computed(() => {
  if (
    (hasAiInfo(props.ai) && props.ai.isDeprecated) ||
    !!props.npm.deprecated ||
    legacyLibraries.find((lib) => lib === props.npm.name)
  ) {
    const deprecatedSuffix = props.npm.deprecated
      ? `: ${props.npm.deprecated}`
      : '. Consider finding alternatives.';
    return {
      name: 'deprecated',
      color: 'D9534F',
      tooltip: 'This package is deprecated' + deprecatedSuffix,
      alt: 'This package is deprecated' + deprecatedSuffix,
    };
  }
  if (
    timeInYearsSinceLastPublished.value &&
    timeInYearsSinceLastPublished.value > 1
  ) {
    return {
      name: 'inactive',
      color: 'F0AD4E',
      tooltip:
        'This package was last published over a year ago. It may not be actively maintained.',
      alt: 'This package was last published over a year ago. It may not be actively maintained.',
    };
  }
  return {
    name: 'active',
    color: '449824',
    tooltip: 'This package is actively maintained.',
    alt: 'This package is actively maintained.',
  };
});
const pkgTypes = computed(() => {
  if (props.npm.hasBuiltinTypes) {
    return {
      name: 'bundled',
      color: '449824',
      tooltip: 'Types definitions are bundled with the npm package',
      alt: 'Types definitions are bundled with the npm package',
    };
  } else if (props.npm.hasOtherTypes) {
    return {
      name: 'separate',
      color: 'F0AD4E',
      tooltip: `Types definitions are provided via a separate npm package: <span class="font-mono">${props.npm.typesPackageName}</span>`,
      alt: `Types definitions are provided via a separate npm package: ${props.npm.typesPackageName}`,
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
