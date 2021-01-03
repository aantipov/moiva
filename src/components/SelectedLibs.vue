<template>
  <!--  Selected libs list  -->
  <div>
    <Loader v-if="isLoading" />

    <div
      v-for="(lib, libIndex) in libs"
      :key="lib.name"
      class="flex items-center justify-between px-3 py-1 hover:bg-gray-50"
    >
      <div class="flex flex-col flex-grow">
        <div class="text-base text-gray-800">
          <!-- Name -->
          <span class="font-mono">
            <span>{{ lib.name }}</span>
            <span class="text-gray-500">@{{ lib.version }}</span>
          </span>
        </div>

        <div class="text-sm text-gray-500">
          <div v-if="githubIsLoading">
            <m-loader-tail-spin v-if="githubIsLoading" />
          </div>

          <div v-else-if="githubIsError" class="text-red-500">
            Error while loading data
          </div>

          <div v-else class="grid grid-cols-12">
            <div class="col-span-6 sm:col-span-2">
              <span>&#9733;</span>
              <span>{{ getStars(libIndex) }}</span>
            </div>

            <div class="col-span-6 sm:col-span-2">
              {{ getAge(libIndex) }}
            </div>

            <div class="col-span-12 sm:col-span-4">
              <span
                >{{
                  githubRepos[libIndex].vulnerabilitiesCount
                }}
                vulnerabilities</span
              >

              <m-chart-info class="inline">
                <p>Both open and closed vulnerabilities are included.</p>
                <p>
                  <a
                    href="https://github.com/advisories?query=ecosystem%3Anpm"
                    target="_blank"
                    >Github</a
                  >
                  data is used to build the chart.
                </p>
                <p>
                  Another good resource to check for vulnerabilities is
                  <a href="https://snyk.io/vuln/?type=npm" target="_blank"
                    >Snyk</a
                  >
                </p>
              </m-chart-info>
            </div>

            <div class="col-span-12 sm:col-span-4">
              {{ lib.dependencies.length }} dependencies
            </div>
          </div>
        </div>

        <div class="font-serif text-sm text-gray-500">
          <i>{{ lib.description }}</i>
        </div>
      </div>

      <div class="flex items-center ml-2">
        <a
          :href="getNpmLink(lib.name)"
          target="_blank"
          class="hidden mr-4 sm:block"
        >
          <NpmIcon />
        </a>

        <a :href="lib.repo" target="_blank" class="mr-4">
          <GithubIcon />
        </a>

        <m-close @click="$emit('deselect', lib.name)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import GithubIcon from './icons/Github.vue';
import Loader from './Loader.vue';
import NpmIcon from './icons/Npm.vue';
import { LibraryT, RepoT } from '../apis';
import { numbersFormatter } from '../utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';

export default defineComponent({
  name: 'SelectedLibs',

  emits: ['deselect'],

  components: {
    GithubIcon,
    NpmIcon,
    Loader,
  },

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
    githubIsLoading: {
      type: Boolean,
      required: true,
    },
    githubIsError: {
      type: Boolean,
      required: true,
    },
    githubRepos: {
      type: Array as () => RepoT[],
      required: true,
    },
  },

  setup(props) {
    const { githubRepos } = toRefs(props);

    return {
      getNpmLink(libName: string): string {
        return `https://www.npmjs.com/package/${encodeURIComponent(libName)}`;
      },
      getStars(libIndex: number): null | string {
        return numbersFormatter.format(githubRepos.value[libIndex].stars);
      },
      getAge(libIndex: number): string {
        const date = githubRepos.value[libIndex].createdAt;

        return formatDistanceToNowStrict(new Date(date));
      },
    };
  },
});
</script>
