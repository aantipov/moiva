import { ref, onMounted, watch, Ref, computed } from 'vue';
import * as Sentry from '@sentry/browser';

export default function useChartApi<T>(
  itemsIds: Ref<string[]>,
  isNotReadyToCall: Ref<boolean>,
  apiMethod: (dataKey: string) => Promise<T | null>
): {
  isLoading: Ref<boolean>;
  isError: Ref<boolean>;
  items: Ref<T[]>;
  successItemsIds: Ref<string[]>;
  failedItemsIds: Ref<string[]>;
} {
  const items = ref<(unknown | null)[]>([]);
  const isLoading = ref(true);
  const isError = ref(false);
  let lastFetchPromise: null | Promise<void> = null;

  function loadData(): void {
    if (isNotReadyToCall.value) {
      return;
    }

    isLoading.value = true;
    isError.value = false;

    const fetchPromise = (lastFetchPromise = Promise.all(
      itemsIds.value.map(apiMethod)
    )
      .then((data) => {
        // Do nothing if there is a new request already in place
        if (lastFetchPromise === fetchPromise) {
          items.value = data;
          isLoading.value = false;
          isError.value = false;
        }
      })
      .catch((err) => {
        Sentry.captureException(err);

        // Do nothing if there is a new request already in place
        if (lastFetchPromise === fetchPromise) {
          isError.value = true;
          isLoading.value = false;
        }
      }));
  }

  onMounted(loadData);

  watch([itemsIds, isNotReadyToCall], loadData);

  return {
    isLoading,
    isError,
    items: computed(() => items.value.filter((item) => !!item) as T[]),
    successItemsIds: computed(() =>
      itemsIds.value.filter((_, itemIdIndex) => !!items.value[itemIdIndex])
    ),
    failedItemsIds: computed(() =>
      isLoading.value
        ? []
        : itemsIds.value.filter((_, itemIdIndex) => !items.value[itemIdIndex])
    ),
  };
}
