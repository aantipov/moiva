// https://material.io/design/color/the-color-system.html#tools-for-picking-colors
export const COLOR_GREEN = '#10B981'; // Emerald 500
export const COLOR_GREEN_DARK = '#059669'; // Emerald 600
export const COLOR_GRAY = '#9CA3AF'; // Gray 400
export const COLOR_GRAY_DARK = '#6B7280'; // Gray 500

export const COLORS = [
  '#DC2626', // Red 600
  '#CA8A04', // Yellow 600
  '#2563EB', // Blue 600
  '#16A34A', // Green 600
  '#7C3AED', // Violet 600
  '#475569', // Blue Grey 600
  '#0891B2', // Cyan 600
  '#EA580C', // Orange 600
  '#65A30D', // Lime 600
  '#0D9488', // Teal 600
  '#DB2777', // Pink 600
  '#57534E', // Warm Gray 600
  '#4F46E5', // Indigo 600
  '#D97706', // Amber 600
  '#9333EA', // Purple 600
  '#0284C7', // Light Blue 600
  '#9E9E9E', // Grey 500
  '#059669', // Emerald 600
  '#C026D3', // Fuchsia 600
  '#E11D48', // Rose 600
];

// Colors list for Languages Chart
const LANGUAGE_COLORS = [
  '#FBBF24', // Amber 400
  '#22D3EE', // Cyan 400
  '#818CF8', // Indigo 400
  '#F87171', // Red 400
  '#4ADE80', // Green 400
  '#FB923C', // Orange 400
  '#60A5FA', // Blue 400
  '#34D399', // Emerald 400
  '#A78BFA', // Violet 400
  '#2DD4BF', // Teal 400
  '#F472B6', // Pink 400
  '#A3E635', // Lime 400
  '#E879F9', // Fuchsia
  '#FB7185', // Rose 400
  '#38BDF8', // Light Blue 400
  '#C084FC', // Purple
  '#FACC15', // Yellow 400
];

export const ISSUES_COLORS = {
  OPEN: '#6B7280', // Gray 500
  OPEN_DARK: '#4B5563', // Gray 600
  OPEN_BUGS: '#EF4444', // Red 500
  OPEN_BUGS_DARK: '#DC2626', // Red 600
  CLOSED: '#D1D5DB', // Gray 300
  CLOSED_DARK: '#9CA3AF', // Gray 400
  CLOSED_BUGS: '#FCA5A5', // Red 300
  CLOSED_BUGS_DARK: '#F87171', // Red 400
};

const langToColorMap = new Map<string, string>();

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
