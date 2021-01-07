// https://material.io/design/color/the-color-system.html#tools-for-picking-colors
export const COLOR_GREEN = '#48bb78';
export const COLOR_GRAY = '#a0aec0';
export const COLOR_PINK = '#ed64a6';

const COLORS = [
  '#F44336', // Red 500
  '#673AB7', // Deep Purple 500
  '#00796B', // Teal 700
  '#03A9F4', // Light Blue 500
  '#FFEB3B', // Yellow 500
  '#4CAF50', // Green 500
  '#795548', // Brown 500
  '#FF5722', // Deep Orange 500
  '#607D8B', // Blue Grey 500
  '#E91E63', // Pink 500
  '#3F51B5', // Indigo 500
  '#00BCD4', // Cyan 500
  '#8BC34A', // Light Green 500
  '#FFC107', // Amber 500
  '#9C27B0', // Purple 500
  '#2196F3', // Blue 500
  '#009688', // Teal 500
  '#CDDC39', // Lime 500
  '#FF9800', // Orange 500
  '#9E9E9E', // Grey 500
];

// Colors list for Languages Chart
const LANGUAGE_COLORS = [
  '#FACC15', // Yellow 400
  '#22D3EE', // Cyan 400
  '#818CF8', // Indigo 400
  '#F87171', // Red 400
  '#4ADE80', // Green 400
  '#FB923C', // Orange 400
  '#60A5FA', // Blue 400
  '#34D399', // Emerald 400
  '#A78BFA', // Violet
  '#2DD4BF', // Teal 400
  '#F472B6', // Pink 400
  '#A3E635', // Lime 400
  '#E879F9', // Fuchsia
  '#FB7185', // Rose 400
  '#38BDF8', // Light Blue 400
  '#FBBF24', // Amber 400
  '#C084FC', // Purple
];

const libToColorMap = new Map<string, string>();
const langToColorMap = new Map<string, string>();

export function getLibToColorMap(libs: string[]): Record<string, string> {
  // Clean up the Map - filter out unused libs
  [...libToColorMap.keys()].forEach((lib) => {
    if (!libs.includes(lib)) {
      libToColorMap.delete(lib);
    }
  });

  // Get a list of unused colors
  const vacantColors = COLORS.filter(
    (color) => ![...libToColorMap.values()].includes(color)
  );

  // Update the Map with the colors for new libs
  libs.forEach((lib) => {
    if (!libToColorMap.has(lib)) {
      libToColorMap.set(lib, vacantColors.shift() || '#9E9E9E');
    }
  });

  return Object.fromEntries(libToColorMap);
}

export function getLangToColorMap(langs: string[]): Record<string, string> {
  // Others "lang" should always be Gray
  if (langs.includes('Others')) {
    langToColorMap.set('Others', COLOR_GRAY);
  }

  // Clean up the lang colors Map - filter out unused langs
  [...langToColorMap.keys()].forEach((lang) => {
    if (!langs.includes(lang)) {
      langToColorMap.delete(lang);
    }
  });

  const usedColors = [...langToColorMap.values()];

  // Get a list of unused colors
  const vacantColors = LANGUAGE_COLORS.filter(
    (color) => !usedColors.includes(color)
  );

  // Update the Map with the colors for new langs
  langs.forEach((lang) => {
    if (!langToColorMap.has(lang)) {
      langToColorMap.set(lang, vacantColors.shift() || COLOR_GRAY);
    }
  });

  return Object.fromEntries(langToColorMap);
}
