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

      <object
        :id="'badge-' + props.pkg.name"
        v-tooltip.html="snykTooltip"
        :data="snykUrl"
        type="image/svg+xml"
        style="max-width: 131px; max-height: 20px"
      ></object>
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

const snykUrl = computed(
  () =>
    `https://snyk-widget.herokuapp.com/badge/npm/${encodeURIComponent(
      props.pkg.name
    )}/badge.svg`
);
const snykTooltip =
  '<p>Security score of the Npm package.</p> <p><a href="https://snyk.io/" target="_blank">Snyk.io</a> calculates it based on the number of vulnerabilities and their severity.</p> "A" - no vulnerabilities, "F" - the least secure level.';
</script>
