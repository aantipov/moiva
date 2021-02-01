<template>
  <div class="w-full px-3 mx-auto lg:w-9/12 xl:w-2/4">
    <a
      v-for="suggestedNpmPackageName in suggestions"
      :key="suggestedNpmPackageName"
      class="inline-block mt-2 mr-3 text-base text-gray-500 no-underline hover:text-gray-700"
      :href="getHrefForAdditionalLib(suggestedNpmPackageName)"
      @click.prevent="$emit('select', suggestedNpmPackageName, true)"
      >+ {{ suggestedNpmPackageName }}</a
    >
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { getSuggestions, constructHref } from '@/utils';
import { npmPackagesNames } from '@/store/libraries';

export default defineComponent({
  name: 'Suggestions',

  emits: ['select'],

  setup() {
    return {
      suggestions: computed<string[]>(() =>
        getSuggestions(npmPackagesNames.value)
      ),
      getHrefForAdditionalLib(npmPackageName: string): string {
        return constructHref([...npmPackagesNames.value, npmPackageName]);
      },
    };
  },
});
</script>

<style lang="postcss"></style>
