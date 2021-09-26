<template>
  <section
    v-if="readings.length > 0"
    class="px-3 mx-auto"
    style="max-width: 700px"
  >
    <h2>Recommended reading</h2>
    <div class="mx-auto w-max max-w-full">
      <div
        v-for="(reading, index) in readings"
        :key="reading.url"
        class="mb-1 w-max text-lg max-w-full"
      >
        <span class="mr-1">{{ index + 1 }}.</span>
        <a :href="reading.url" target="_blank">{{ reading.title }}</a>
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
