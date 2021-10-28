import { ref, watch, Ref } from 'vue';
import { isString } from '@vueuse/shared';

export function useMetaDescription(): Ref<string> {
  const el = document.querySelector(`meta[name="Description"]`) as HTMLElement;
  const content = ref(el.getAttribute('content') || '');

  watch(
    content,
    (t, o) => {
      if (isString(t) && t !== o) el.setAttribute('content', t);
    },
    { immediate: true }
  );

  return content;
}
