<template>
  <!--  Selected libraries list  -->
  <div>
    <Loader v-if="isLoading" />

    <div
      v-for="lib in libraries"
      :key="lib.id"
      class="flex items-center justify-between px-3 py-2 hover:bg-white"
    >
      <div
        class="self-stretch flex-shrink-0 w-2 mr-2"
        :style="{ backgroundColor: getLibColor(lib.id) }"
      ></div>

      <div class="flex flex-col flex-grow">
        <div class="flex justify-between">
          <!-- Name -->
          <div class="mb-1">
            <div v-if="lib.npmPackage" class="flex items-center mb-1">
              <a
                :href="getNpmLink(lib.npmPackage.name)"
                target="_blank"
                class="inline-block pt-1 w-9"
              >
                <NpmIcon class="w-8" />
              </a>

              <a
                :href="getNpmLink(lib.npmPackage.name)"
                target="_blank"
                class="ml-1 link"
              >
                <span>{{ lib.npmPackage.name }}</span>
                <span class="text-gray-500">@{{ lib.npmPackage.version }}</span>
              </a>
            </div>

            <div class="flex items-center">
              <a :href="lib.repo" target="_blank" class="flex inline-block w-9">
                <GithubIcon class="w-4 h-4" />
              </a>
              <a
                :href="getGithubLink(lib.repo.repoId)"
                target="_blank"
                class="ml-1 link"
              >
                {{ lib.repo.repoId }}
              </a>
            </div>
          </div>

          <!--  Links  -->
          <div class="flex">
            <!-- Desktop -->
            <LibExternalLinks :library="lib" class="hidden sm:flex" />

            <a
              class="flex items-center ml-3"
              :href="getRemainedLibsLink(lib)"
              @click.prevent="removeLibrary(lib.id)"
            >
              <m-close />
            </a>
          </div>
        </div>

        <!-- Mobile -->
        <LibExternalLinks :library="lib" class="my-2 sm:hidden" />

        <div class="text-sm text-black text-opacity-70">
          <div class="grid grid-cols-12">
            <div class="col-span-6 sm:col-span-2">
              <span>&#9733;</span>
              <span>{{ getFormattedStars(lib.repo.stars) }}</span>
            </div>

            <div class="col-span-6 sm:col-span-2">
              <div>
                {{ getAge(lib.repo.createdAt) }} old

                <m-chart-info class="inline">
                  <p>Birthdate {{ getBirthdate(lib.repo.createdAt) }}</p>
                </m-chart-info>
              </div>
            </div>

            <div v-if="lib.npmPackage" class="col-span-6 sm:col-span-4">
              {{ lib.npmPackage.dependencies.length }} npm dependencies
            </div>
          </div>

          <div v-if="lib.npmPackage">License: {{ lib.npmPackage.license }}</div>
        </div>

        <div class="font-serif text-sm text-black text-opacity-70">
          <i>{{ lib.repo.description }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Loader from './Loader.vue';
import LibExternalLinks from './LibExternalLinks.vue';
import { LibraryT } from '@/libraryApis';
import NpmIcon from './icons/Npm.vue';
import GithubIcon from './icons/Github.vue';
import { constructHref, numbersFormatter } from '@/utils';
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict';
import format from 'date-fns/format';
import { libraryToColorMap } from '@/store/librariesColors';
import { libraries, isLoading, removeLibrary } from '@/store/libraries';

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
      getRemainedLibsLink(deletedLib: LibraryT): string {
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
    };
  },
});
</script>

<style lang="postcss" scoped>
.link {
  @apply font-mono text-sm sm:text-base text-primary no-underline hover:underline font-medium;
}
</style>
