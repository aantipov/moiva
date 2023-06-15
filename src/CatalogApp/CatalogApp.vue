<template>
  <div>
    <!-- Catalog Header -->
    <div class="flex items-center justify-start">
      <img
        src="/images/moiva-head.png"
        alt="Moiva.io logo"
        width="100"
        height="100"
        class="mr-4"
      />
      <h1 class="m-0 w-auto text-5xl">Moiva.io Catalog</h1>
    </div>

    <!-- Catalog Body -->
    <div class="mt-8">
      <div v-for="catalogEntry in entries" :key="catalogEntry.category">
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
interface CatalogCategoryT {
  category: string;
  libraries: {
    repoId: string;
    alias: string;
    href: string;
  }[];
}

defineProps<{ entries: CatalogCategoryT[] }>();
</script>
