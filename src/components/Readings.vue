<template>
  <section v-if="readings.length > 0" class="px-3 mx-auto root">
    <h2>Recommended reading</h2>
    <div>
      <div
        v-for="(reading, index) in readings"
        :key="reading.url"
        class="mb-1 flex text-lg"
      >
        <span class="mr-1">{{ index + 1 }}.</span>
        <m-ext-link :href="reading.url" :txt="reading.title" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { librariesRR } from '@/store/libraries';
import { NpmPackageT } from '@/libraryApis';
import { ReadingT } from '@/getLibrary';
import _readings from '@/data/readings.json';

const npmsRef = computed<string[]>(() =>
  librariesRR
    .filter((lib) => !!lib.npmPackage)
    .map((lib) => (lib.npmPackage as NpmPackageT).name)
);

const reposRef = computed<string[]>(() =>
  librariesRR.filter((lib) => !lib.npmPackage).map((lib) => lib.repo.repoId)
);

const readings = computed<ReadingT[]>(() =>
  (_readings as ReadingT[]).filter(
    (reading) =>
      npmsRef.value.some((npm) => reading.npms.includes(npm)) ||
      reposRef.value.some((repoId) => reading.repos.includes(repoId))
  )
);
</script>

<style lang="postcss">
.root {
  max-width: 600px;
}
</style>
