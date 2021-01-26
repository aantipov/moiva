<template>
  <!--  Selected libs list  -->
  <div>
    <Loader v-if="npmIsLoading" />

    <div
      v-for="(lib, libIndex) in libs"
      :key="lib.name"
      class="flex items-center justify-between px-3 py-2 hover:bg-yellow-600 hover:bg-opacity-10"
    >
      <div
        class="self-stretch flex-shrink-0 w-2 mr-2"
        :style="{ backgroundColor: getLibColor(lib.repoId) }"
      ></div>

      <div class="flex flex-col flex-grow">
        <div class="flex justify-between">
          <!-- Name -->
          <div class="mb-1">
            <div class="flex items-center mb-1">
              <a
                :href="getNpmLink(lib.name)"
                target="_blank"
                class="inline-block pt-1 w-9"
              >
                <NpmIcon class="w-8" />
              </a>

              <a :href="getNpmLink(lib.name)" target="_blank" class="ml-1 link">
                <span>{{ lib.name }}</span>
                <span class="text-gray-500">@{{ lib.version }}</span>
              </a>
            </div>

            <div class="flex items-center">
              <a :href="lib.repo" target="_blank" class="flex inline-block w-9">
                <GithubIcon class="w-4 h-4" />
              </a>
              <a :href="lib.repo" target="_blank" class="ml-1 link">
                {{ getRepoId(lib.repo) }}
              </a>
            </div>
          </div>

          <!--  Links  -->
          <div class="flex">
            <!-- Desktop -->
            <LibExternalLinks :lib-name="lib.name" class="hidden sm:flex" />

            <a
              class="flex items-center ml-3"
              :href="getRemainedLibsLink(lib.name)"
              @click.prevent="$emit('deselect', lib.name)"
            >
              <m-close />
            </a>
          </div>
        </div>

        <!-- Mobile -->
        <LibExternalLinks :lib-name="lib.name" class="my-2 sm:hidden" />

        <div class="text-sm text-gray-500">
          <div v-if="githubIsLoading">
            <m-loader-tail-spin v-if="githubIsLoading" />
          </div>

          <div v-else-if="githubIsError" class="text-red-500">
            Error while loading data
          </div>

          <div v-else class="grid grid-cols-12">
            <div class="col-span-6 sm:col-span-2">
              <div v-if="!hasRepoError(libIndex)">
                <span>&#9733;</span>
                <span>{{ getStars(libIndex) }}</span>
              </div>
            </div>

            <div class="col-span-6 sm:col-span-2">
              <div v-if="!hasRepoError(libIndex)">
                {{ getAge(libIndex) }} old

                <m-chart-info class="inline">
                  <p>Birthdate {{ getBirthdate(libIndex) }}</p>
                </m-chart-info>
              </div>
            </div>

            <div class="col-span-6 sm:col-span-4">
              <div v-if="!hasRepoError(libIndex)">
                <span
                  >{{
                    githubRepos[libIndex].vulnerabilitiesCount
                  }}
                  vulnerabilities</span
                >

                <m-chart-info class="inline">
                  <p>
                    The number includes both open and closed vulnerabilities.
                  </p>
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import Loader from './Loader.vue';
import LibExternalLinks from './LibExternalLinks.vue';
import { LibraryT, RepoT } from '../apis';
import NpmIcon from './icons/Npm.vue';
import GithubIcon from './icons/Github.vue';
import { numbersFormatter, constructHref } from '../utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import format from 'date-fns/format';

export default defineComponent({
  name: 'SelectedLibs',

  components: {
    LibExternalLinks,
    Loader,
    NpmIcon,
    GithubIcon,
  },

  props: {
    npmIsLoading: {
      type: Boolean,
      required: true,
    },
    libs: {
      type: Array as () => LibraryT[],
      required: true,
    },
    repoToColorMap: {
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

  emits: ['deselect'],

  setup(props) {
    const { githubRepos, libs, repoToColorMap } = toRefs(props);
    const libNames = computed(() => libs.value.map((lib) => lib.name));

    return {
      getNpmLink(libName: string): string {
        return `https://www.npmjs.com/package/${encodeURIComponent(libName)}`;
      },
      getRepoId(repoUrl: string): string {
        return repoUrl.slice(repoUrl.indexOf('github.com') + 11);
      },
      hasRepoError(libIndex: number): boolean {
        return !githubRepos.value[libIndex];
      },
      getStars(libIndex: number): null | string {
        return numbersFormatter.format(githubRepos.value[libIndex].stars);
      },
      getAge(libIndex: number): string {
        const date = githubRepos.value[libIndex].createdAt;

        return formatDistanceToNowStrict(new Date(date));
      },
      getBirthdate(libIndex: number): string {
        const date = githubRepos.value[libIndex].createdAt;

        return format(new Date(date), 'yyyy-MM-dd');
      },
      getRemainedLibsLink(deletedLibName: string): string {
        return constructHref(
          libNames.value.filter((libName) => libName !== deletedLibName)
        );
      },
      getLibColor(repoId: string): string {
        return repoToColorMap.value[repoId];
      },
    };
  },
});
</script>

<style lang="postcss" scoped>
.link {
  @apply font-mono text-sm sm:text-base text-gray-800 no-underline hover:text-gray-800 hover:underline font-medium;
}
</style>
