<template>
  <!--  Selected libs list  -->
  <div>
    <Loader v-if="isLoading" />

    <div
      v-for="(lib, libIndex) in libs"
      :key="lib.name"
      class="flex items-center justify-between px-3 py-2 hover:bg-gray-50"
    >
      <div
        class="self-stretch flex-shrink-0 w-2 mr-2 bg-green-200"
        :style="{ backgroundColor: getLibColor(lib.name) }"
      ></div>

      <div class="flex flex-col flex-grow">
        <div
          class="flex items-center justify-between mb-1 text-base text-gray-800"
        >
          <!-- Name -->
          <span class="font-mono">
            <span>{{ lib.name }}</span>
            <span class="text-gray-500">@{{ lib.version }}</span>
          </span>

          <m-close class="sm:hidden" @click="$emit('deselect', lib.name)" />
        </div>

        <!--  Links (mobile)  -->
        <div class="flex sm:hidden">
          <a :href="getNpmLink(lib.name)" target="_blank" class="mr-4">
            <NpmIcon />
          </a>

          <a :href="lib.repo" target="_blank" class="mr-4">
            <GithubIcon />
          </a>
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

            <div class="col-span-6 sm:col-span-4">
              <span
                >{{
                  githubRepos[libIndex].vulnerabilitiesCount
                }}
                vulnerabilities</span
              >

              <m-chart-info class="inline">
                <p>The number includes both open and closed vulnerabilities.</p>
                <p>
                  We use
                  <a
                    href="https://github.com/advisories?query=ecosystem%3Anpm"
                    target="_blank"
                    >Github</a
                  >
                  data to get the number.
                </p>
                <p>
                  <a href="https://snyk.io/vuln/?type=npm" target="_blank"
                    >Snyk</a
                  >
                  is another good resource to check for vulnerabilities.
                </p>
              </m-chart-info>
            </div>

            <div class="col-span-6 sm:col-span-4">
              {{ lib.dependencies.length }} dependencies
            </div>
          </div>

          <div>License: {{ lib.license }}</div>
        </div>

        <div class="font-serif text-sm text-gray-500">
          <i>{{ lib.description }}</i>
        </div>
      </div>

      <div class="items-center hidden ml-2 sm:flex">
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

        <a
          :href="getRemainedLibsLink(lib.name)"
          @click.prevent="$emit('deselect', lib.name)"
        >
          <m-close />
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import GithubIcon from './icons/Github.vue';
import Loader from './Loader.vue';
import NpmIcon from './icons/Npm.vue';
import { LibraryT, RepoT } from '../apis';
import { numbersFormatter, constructHref } from '../utils';
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
    libToColorMap: {
      type: Object as () => Record<string, string>,
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
    const { githubRepos, libs, libToColorMap } = toRefs(props);
    const libNames = computed(() => libs.value.map((lib) => lib.name));

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
      getRemainedLibsLink(deletedLibName: string): string {
        return constructHref(
          libNames.value.filter((libName) => libName !== deletedLibName)
        );
      },
      getLibColor(lib: string): string {
        return libToColorMap.value[lib];
      },
    };
  },
});
</script>
