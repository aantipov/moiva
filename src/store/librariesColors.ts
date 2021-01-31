import { reactive, computed } from 'vue';
import { COLORS } from '@/colors';

const libraryToColorMapMap = reactive(new Map<string, string>());

export const libraryToColorMap = computed(() => {
  return Object.fromEntries(libraryToColorMapMap);
});

export function updateLibrariesColors(librariesIds: string[]): void {
  // Clean up the Map - filter out unused libraries
  [...libraryToColorMapMap.keys()].forEach((libraryId) => {
    if (!librariesIds.includes(libraryId)) {
      libraryToColorMapMap.delete(libraryId);
    }
  });

  // Get a list of unused colors
  const vacantColors = COLORS.filter(
    (color) => ![...libraryToColorMapMap.values()].includes(color)
  );

  // Update the Map with the colors for new libs
  librariesIds.forEach((libraryId) => {
    if (!libraryToColorMapMap.has(libraryId)) {
      libraryToColorMapMap.set(libraryId, vacantColors.shift() || '#9E9E9E');
    }
  });
}
