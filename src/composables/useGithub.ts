import { ref, onMounted, watch, computed, Ref } from 'vue';
import { fetchGithubData, RepoT, LibraryT } from '../apis';

export interface LibraryGithubEnhancedT extends LibraryT {
  githubName: string;
  githubOwner: string;
}

export default function useGithub(
  libs: Ref<LibraryT[]>
): {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  dataPromise: Ref<null | Promise<void>>;
  repositories: Ref<RepoT[]>;
} {
  const isLoading = ref(true);
  const isError = ref(false);
  const dataPromise = ref<null | Promise<void>>(null);
  const repositories = ref<RepoT[]>([]);
  const librariesEnchanced = computed<LibraryGithubEnhancedT[]>(() =>
    libs.value.map((lib) => {
      const repoParts = lib.repo.split('/');

      return {
        ...lib,
        githubOwner: repoParts[3],
        githubName: repoParts[4],
      };
    })
  );

  function loadData(): void {
    isLoading.value = true;
    isError.value = false;

    const localPromise = (dataPromise.value = Promise.all(
      librariesEnchanced.value.map((lib) =>
        fetchGithubData(lib.githubName, lib.githubOwner, lib.name)
      )
    )
      .then((data) => {
        // Do nothing if there is a new request already in place
        if (dataPromise.value === localPromise) {
          repositories.value = data;
          isLoading.value = false;
          isError.value = false;
        }
      })
      .catch(() => {
        // Do nothing if there is a new request already in place
        if (dataPromise.value === localPromise) {
          isError.value = true;
          isLoading.value = false;
        }
      }));
  }

  onMounted(loadData);

  watch(libs, loadData);

  return {
    isLoading,
    isError,
    dataPromise,
    repositories,
  };
}
