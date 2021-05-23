import { reactive, computed } from 'vue';
import { COLORS } from '@/colors';

export const libraryToColorMapR = reactive(new Map<string, string>());

export const libraryToColorMap = computed(() => {
  return Object.fromEntries(libraryToColorMapR);
});

export function updateLibrariesColors(librariesIds: string[]): void {
  // Clean up the Map - filter out unused libraries
  [...libraryToColorMapR.keys()].forEach((libraryId) => {
    if (!librariesIds.includes(libraryId)) {
      libraryToColorMapR.delete(libraryId);
    }
  });

  // Get a list of unused colors
  const vacantColors = COLORS.filter(
    (color) => ![...libraryToColorMapR.values()].includes(color)
  );

  // Update the Map with the colors for new libs
  librariesIds.forEach((libraryId) => {
    if (!libraryToColorMapR.has(libraryId)) {
      libraryToColorMapR.set(libraryId, vacantColors.shift() || '#9E9E9E');
    }
  });
}
