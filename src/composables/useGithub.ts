import { ref, onMounted, watch, Ref } from 'vue';
import { fetchGithubData, RepoT, NpmPackageT } from '@/apis';
import * as Sentry from '@sentry/browser';

export default function useGithub(
  libs: Ref<NpmPackageT[]>
): {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  dataPromise: Ref<null | Promise<void>>;
  repositories: Ref<(RepoT | null)[]>;
} {
  const isLoading = ref(true);
  const isError = ref(false);
  const dataPromise = ref<null | Promise<void>>(null);
  const repositories = ref<(RepoT | null)[]>([]);

  function loadData(): void {
    isLoading.value = true;
    isError.value = false;

    const localPromise = (dataPromise.value = Promise.all(
      libs.value.map((lib) => fetchGithubData(lib.repo, lib.name))
    )
      .then((data) => {
        // Do nothing if there is a new request already in place
        if (dataPromise.value === localPromise) {
          repositories.value = data;
          isLoading.value = false;
          isError.value = false;
        }
      })
      .catch((err) => {
        Sentry.captureException(err);

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
