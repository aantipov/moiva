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

export function getLibToColorMap(libs: string[]): Record<string, string> {
  return libs.reduce((accum, lib, index) => {
    accum[lib] = COLORS[index];
    return accum;
  }, {} as Record<string, string>);
}
