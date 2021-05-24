<template>
  <div>
    <Loader v-if="isLoading" />

    <div class="flex justify-end pr-4">
      <a v-tooltip="`Clear selection`" href="/" @click.prevent="clearSelection"
        >Clear</a
      >
    </div>

    <!--  Selected libraries list  -->
    <div class="divide-y divide-primary divide-opacity-40">
      <div
        v-for="lib in libraries"
        :key="lib.id"
        class="flex items-center justify-between px-3 py-2 hover:bg-black hover:bg-opacity-5"
      >
        <div
          class="self-stretch flex-shrink-0 w-2 mr-2"
          :style="{ backgroundColor: getLibColor(lib.id) }"
        ></div>

        <div class="flex flex-col flex-grow">
          <div class="flex justify-between">
            <!-- Name -->
            <div class="mb-1">
              <!-- NPM -->
              <div v-if="lib.npmPackage" class="flex items-center mb-1">
                <a
                  v-tooltip="`Npm package page`"
                  :href="getNpmLink(lib.npmPackage.name)"
                  target="_blank"
                  class="link"
                >
                  <span>{{ lib.npmPackage.name }}</span>
                  <span class="text-black text-opacity-60"
                    >@{{ lib.npmPackage.version }}</span
                  >
                </a>

                <a
                  v-tooltip="`Npm package page`"
                  :href="getNpmLink(lib.npmPackage.name)"
                  target="_blank"
                  class="inline-block ml-2 w-9"
                >
                  <NpmIcon class="w-8" />
                </a>
              </div>

              <!-- GitHub -->
              <div class="flex items-center">
                <a
                  v-tooltip="`GitHub repository`"
                  :href="getGithubLink(lib.repo.repoId)"
                  target="_blank"
                  class="link"
                >
                  {{ lib.repo.repoId }}
                </a>
                <a
                  v-tooltip="`GitHub repository`"
                  :href="getGithubLink(lib.repo.repoId)"
                  target="_blank"
                  class="flex inline-block ml-2 w-9"
                >
                  <GithubIcon class="w-4 h-4" />
                </a>
              </div>
            </div>

            <!--  Remove Button  -->
            <div class="flex">
              <a
                v-tooltip="`Remove ${lib.repo.repoId}`"
                class="flex items-center ml-3"
                :href="getRemainedLibsLink(lib)"
                @click.prevent="removeLibrary(lib.id)"
              >
                <m-close />
              </a>
            </div>
          </div>

          <LibExternalLinks :library="lib" class="my-1" />

          <div class="text-sm text-black text-opacity-70">
            <div class="flex">
              <span>&#9733;</span>
              <span>{{ getFormattedStars(lib.repo.stars) }}</span>

              <div
                v-tooltip="`Birthdate ${getBirthdate(lib.repo.createdAt)}`"
                style="cursor: default"
                class="ml-3"
              >
                {{ getAge(lib.repo.createdAt) }} old
              </div>

              <div v-if="lib.npmPackage" class="ml-3">
                {{ lib.npmPackage.dependencies.length }} npm dependencies
              </div>
            </div>

            <div v-if="lib.npmPackage">
              License: {{ lib.npmPackage.license }}
            </div>
          </div>

          <div class="font-serif text-sm text-black text-opacity-70">
            <i>{{ lib.repo.description }}</i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from './Loader.vue';
import LibExternalLinks from './LibExternalLinks.vue';
import { LibraryReadonlyT } from '@/libraryApis';
import NpmIcon from './icons/Npm.vue';
import GithubIcon from './icons/Github.vue';
import { constructHref, numbersFormatter } from '@/utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import format from 'date-fns/format';
import { libraryToColorMap } from '@/store/librariesColors';
import {
  libraries,
  isLoading,
  removeLibrary,
  removeAllLibraries,
} from '@/store/libraries';

export default defineComponent({
  name: 'SelectedLibs',

  components: {
    LibExternalLinks,
    Loader,
    NpmIcon,
    GithubIcon,
  },

  setup() {
    return {
      libraries,
      isLoading,
      removeLibrary,
      getFormattedStars(stars: number): string {
        return numbersFormatter.format(stars);
      },
      getNpmLink(pkgName: string): string {
        return `https://www.npmjs.com/package/${encodeURIComponent(pkgName)}`;
      },
      getGithubLink(repoId: string): string {
        return `https://github.com/${repoId}`;
      },
      getAge(createdAt: string): string {
        return formatDistanceToNowStrict(new Date(createdAt));
      },
      getBirthdate(createdAt: string): string {
        return format(new Date(createdAt), 'yyyy-MM-dd');
      },
      getRemainedLibsLink(deletedLib: LibraryReadonlyT): string {
        const npmPackagesNames = [] as string[];
        const reposIds = [] as string[];

        libraries.forEach((library) => {
          if (library.npmPackage) {
            npmPackagesNames.push(library.npmPackage.name);
          } else {
            reposIds.push(library.repo.repoId);
          }
        });

        if (deletedLib.npmPackage) {
          const index = npmPackagesNames.indexOf(deletedLib.npmPackage.name);
          npmPackagesNames.splice(index, 1);
        } else {
          const index = reposIds.indexOf(deletedLib.repo.repoId);
          reposIds.splice(index, 1);
        }

        return constructHref(npmPackagesNames, reposIds);
      },
      getLibColor(libraryId: string): string {
        return libraryToColorMap.value[libraryId];
      },
      clearSelection() {
        removeAllLibraries();
      },
    };
  },
});
</script>

<style lang="postcss" scoped>
.link {
  @apply font-mono text-sm sm:text-base font-medium;
}
</style>
