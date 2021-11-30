import { ref, Ref } from 'vue';
import { useData } from 'vitepress';
import metadata from '../metadata.json';

export function useReadTime(): Ref<string> {
  const { page } = useData();
  const relativePath = page.value.relativePath;
  const path = relativePath.slice(0, relativePath.indexOf('/'));
  const pageMetadata = metadata.find(({ href }) => href === `/${[path]}/`);
  return ref(pageMetadata.readTime);
}
