<template>
  <LanguagesChart
    :is-loading="isLoading"
    :is-error="isError"
    :libs="libNames"
    :languages="libsLanguages"
    :libs-languages-shares="libsLanguagesShares"
    :languages-names="languagesNames"
  />
</template>

<script lang="ts">
import { defineComponent, onMounted, toRefs, ref, computed, watch } from 'vue';
import LanguagesChart from './LanguagesChart.vue';
import { fetchRepoLanguages, LibraryT } from '@/apis';
import { GithubLanguagesResponseT } from '../../api/gh-languages';

export default defineComponent({
  name: 'Languages',

  components: {
    LanguagesChart,
  },

  props: {
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
  },

  setup(props) {
    const { libs } = toRefs(props);
    const libNames = computed<string[]>(() =>
      libs.value.map(({ name }) => name)
    );
    const libsLanguages = ref<null | GithubLanguagesResponseT[]>(null);

    // Compute languages shares, counting only those which has >=10% share
    const libsLanguagesShares = computed<null | Record<string, number>[]>(
      () => {
        return libsLanguages.value
          ? libsLanguages.value.map((libLangs) => {
              const libBytesTotal = Object.values(libLangs).reduce(
                (a, b) => a + b,
                0
              );

              const libLanguagesSharesWithoutOthers = Object.entries(libLangs)
                .map(([lang, langBytes]) => ({
                  lang,
                  langShare: (100 * langBytes) / libBytesTotal,
                }))
                .filter(({ langShare }) => langShare >= 10)
                .reduce((acc, { lang, langShare }) => {
                  acc[lang] = Number.parseFloat(Number(langShare).toFixed(1));
                  return acc;
                }, {} as Record<string, number>);

              const othersShare =
                100 -
                Object.values(libLanguagesSharesWithoutOthers).reduce(
                  (a, b) => a + b,
                  0
                );

              const libLanguagesShares = {
                ...libLanguagesSharesWithoutOthers,
                Others: Number.parseFloat(Number(othersShare).toFixed(1)),
              };

              return (libLanguagesShares as unknown) as Record<string, number>;
            })
          : null;
      }
    );

    // Compute langauges names that has share >=10%
    // and sort them
    const languagesNames = computed<null | string[]>(() => {
      if (!libsLanguagesShares.value) {
        return null;
      }
      const languagesNamesWithDupes = libsLanguagesShares.value
        .map((libLangsShares) => Object.keys(libLangsShares))
        .flat();

      // Deduplicate languages
      const items = [...new Set(languagesNamesWithDupes)];

      // Sort languages so that JavaScript/TypeScript are the first ones, Others is the last
      const tsIndex = items.indexOf('TypeScript');
      if (tsIndex !== -1) {
        items.splice(tsIndex, 1);
        items.unshift('TypeScript');
      }

      const jsIndex = items.indexOf('JavaScript');
      if (jsIndex !== -1) {
        items.splice(jsIndex, 1);
        items.unshift('JavaScript');
      }
      const othersIndex = items.indexOf('Others');
      if (othersIndex !== -1) {
        items.splice(othersIndex, 1);
        items.push('Others');
      }
      return items;
    });

    const isLoading = ref(true);
    const isError = ref(false);
    let dataPromise: null | Promise<void> = null;

    function loadData(): void {
      isLoading.value = true;
      isError.value = false;
      const localPromise = (dataPromise = Promise.all(
        libs.value.map(({ repo }) => fetchRepoLanguages(repo))
      )
        .then((data) => {
          // Do nothing if there is a new request already in place
          if (dataPromise === localPromise) {
            libsLanguages.value = data;
            isLoading.value = false;
            isError.value = false;
          }
        })
        .catch(() => {
          // Do nothing if there is a new request already in place
          if (dataPromise === localPromise) {
            isLoading.value = false;
            isError.value = true;
          }
        }));
    }

    onMounted(loadData);

    watch(libs, loadData);

    return {
      isLoading,
      isError,
      libsLanguages,
      libsLanguagesShares,
      languagesNames,
      libNames,
    };
  },
});
</script>
