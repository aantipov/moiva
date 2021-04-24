import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

Chart.register(...registerables);

Chart.defaults.font.size = 14;
Chart.defaults.font.family =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
Chart.defaults.plugins.title.padding = 0;
Chart.defaults.plugins.title.font.size = 14;
Chart.defaults.plugins.title.font.family =
  'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

Chart.defaults.plugins.legend.labels.boxWidth = 20;
Chart.defaults.maintainAspectRatio = false;
// @ts-ignore
Chart.defaults.elements.line.borderWidth = 4;
// @ts-ignore
Chart.defaults.elements.line.fill = false;
// @ts-ignore
Chart.defaults.elements.line.tension = 0;

// @ts-ignore
Chart.defaults.elements.point.radius = 4;
// @ts-ignore
Chart.defaults.elements.point.hoverRadius = 6;

Chart.defaults.plugins.tooltip.mode = 'index';
Chart.defaults.plugins.tooltip.bodySpacing = 6;
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.intersect = false;
Chart.defaults.plugins.tooltip.callbacks.label = (context): string => {
  const label = context.dataset.label;
  return ` ${label}: ${Number(context.parsed.y).toLocaleString()}`;
};
