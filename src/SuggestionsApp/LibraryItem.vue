<template>
  <div class="inline-block">
    <span
      class="mr-2 mt-2 inline-block cursor-pointer rounded border border-primary bg-primary px-1 text-base text-white hover:bg-black/10 hover:text-primary hover:underline hover:shadow-md active:bg-black/20 active:shadow-none"
      @click.prevent="$emit('select', library)"
      >- {{ library.alias }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { constructHref } from '@/utils';
import {
  $trimmedLibraries,
  TrimmedLibraryT,
} from '@/nanostore/trimmedLibraries';
import { useStore } from '@nanostores/vue';

defineEmits(['select']);

defineProps({
  library: {
    type: Object as PropType<TrimmedLibraryT>,
    required: true,
  },
});

const libraries = useStore($trimmedLibraries);

function getHref(library: TrimmedLibraryT): string {
  const npmPackagesNames = [] as string[];
  const reposIds = [] as string[];

  libraries.value.forEach((catalogLibrary) => {
    if (catalogLibrary.npmPackage) {
      if (library.npmPackage?.name !== catalogLibrary.npmPackage.name) {
        npmPackagesNames.push(catalogLibrary.npmPackage.name);
      }
    } else {
      if (library.repo.repoId !== catalogLibrary.repo.repoId) {
        reposIds.push(catalogLibrary.repo.repoId);
      }
    }
  });

  return constructHref(npmPackagesNames, reposIds);
}
</script>
