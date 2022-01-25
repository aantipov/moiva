<template>
  <div class="mx-auto w-full lg:w-9/12 xl:w-2/4">
    <!-- Catalog Header -->
    <div class="flex items-center justify-start">
      <img
        src="/images/moiva-head.png"
        alt="Moiva.io logo"
        width="100"
        height="100"
        class="mr-4"
      />
      <h1 class="m-0 w-auto text-5xl">
        <a href="/" title="Home">Moiva.io</a>
        Catalog
      </h1>
    </div>

    <!-- Catalog Body -->
    <div class="mt-8">
      <div v-for="catalogEntry in catalogEntries" :key="catalogEntry.category">
        <h2 class="mt-4 text-left">
          {{ catalogEntry.category }}
        </h2>

        <div class="flex flex-wrap">
          <a
            v-for="lib in catalogEntry.libraries"
            :key="lib.repoId"
            class="mb-4 mr-4"
            :href="lib.href"
          >
            {{ lib.alias }}
          </a>
        </div>
      </div>
    </div>

    <div class="mt-12 text-center font-light">
      Contributions to Moiva Catalog are very
      <a href="https://github.com/aantipov/moiva-catalog" target="_blank"
        >welcome</a
      >!
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLibraryHref } from '@/utils';
import { catalogLibraries } from '@/data/index';
import { sortBy, prop } from 'ramda';

interface CatalogCategoryT {
  category: string;
  libraries: {
    repoId: string;
    alias: string;
    href: string;
  }[];
}

const _catalogEntries = catalogLibraries
  // group by category
  .reduce((acc, lib) => {
    let entry = acc.find((item) => item.category === lib.category);

    if (!entry) {
      entry = { category: lib.category, libraries: [] };
      acc.push(entry);
    }

    entry.libraries.push({
      repoId: lib.repoId,
      alias: lib.alias,
      href: getLibraryHref(lib),
    });

    return acc;
  }, [] as CatalogCategoryT[])
  .filter((entry) => entry.category !== 'misc')
  // sort libraries withing each category
  .map(({ category, libraries }) => ({
    category,
    libraries: sortBy(prop('alias'), libraries),
  }));

const catalogEntries = sortBy(prop('category'), _catalogEntries);
</script>
