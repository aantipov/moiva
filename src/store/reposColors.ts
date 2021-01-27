import { reactive, computed } from 'vue';
import { COLORS } from '@/colors';

const repoToColorMapMap = reactive(new Map<string, string>());

export const repoToColorMap = computed(() => {
  return Object.fromEntries(repoToColorMapMap);
});

export function updateReposColors(repoIds: string[]): void {
  // Clean up the Map - filter out unused repos
  [...repoToColorMapMap.keys()].forEach((repoId) => {
    if (!repoIds.includes(repoId)) {
      repoToColorMapMap.delete(repoId);
    }
  });

  // Get a list of unused colors
  const vacantColors = COLORS.filter(
    (color) => ![...repoToColorMapMap.values()].includes(color)
  );

  // Update the Map with the colors for new libs
  repoIds.forEach((repoId) => {
    if (!repoToColorMapMap.has(repoId)) {
      repoToColorMapMap.set(repoId, vacantColors.shift() || '#9E9E9E');
    }
  });
}
